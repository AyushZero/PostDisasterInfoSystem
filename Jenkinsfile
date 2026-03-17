pipeline {
    agent any

    environment {
        ECR_REGISTRY   = credentials('ecr-registry')
        AWS_REGION     = 'ap-south-1'
        K8S_NAMESPACE  = 'disaster-platform'
        BACKEND_IMAGE  = "${ECR_REGISTRY}/disaster-backend"
        FRONTEND_IMAGE = "${ECR_REGISTRY}/disaster-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    sh '''
                        python -m venv venv
                        . venv/bin/activate
                        pip install -r requirements.txt
                        python -m pytest tests/ -v --tb=short || true
                    '''
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                        npm install
                        npm run build
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            sh "docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} -t ${BACKEND_IMAGE}:latest ."
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            sh "docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} -t ${FRONTEND_IMAGE}:latest ."
                        }
                    }
                }
            }
        }

        stage('Push to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region ${AWS_REGION} | \
                    docker login --username AWS --password-stdin ${ECR_REGISTRY}
                '''
                sh "docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}"
                sh "docker push ${BACKEND_IMAGE}:latest"
                sh "docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}"
                sh "docker push ${FRONTEND_IMAGE}:latest"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl set image deployment/backend \
                        backend=${BACKEND_IMAGE}:${BUILD_NUMBER} \
                        -n ${K8S_NAMESPACE}
                    kubectl set image deployment/frontend \
                        frontend=${FRONTEND_IMAGE}:${BUILD_NUMBER} \
                        -n ${K8S_NAMESPACE}
                    kubectl rollout status deployment/backend -n ${K8S_NAMESPACE} --timeout=120s
                    kubectl rollout status deployment/frontend -n ${K8S_NAMESPACE} --timeout=120s
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
        always {
            cleanWs()
        }
    }
}
