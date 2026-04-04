pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'myregistry/ecommerce-catalog'
        IMAGE_TAG = "${env.BUILD_NUMBER}" // Versioning using build number
        // Credentials ID in Jenkins for Docker Registry
        DOCKER_CREDENTIALS_ID = 'docker-hub-creds' 
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install & Lint') {
            steps {
                sh 'npm ci'
                sh 'npm run lint'
            }
        }
        
        // SonarQube integration (Optional/Hypothetical)
        stage('Code Quality Analysis') {
            steps {
                echo "Running SonarQube Scanner..."
                // sh 'sonar-scanner -Dsonar.projectKey=ecommerce-catalog'
            }
        }
        
        stage('Build Image') {
            steps {
                echo "Building multi-stage Docker image..."
                sh "docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} -t ${DOCKER_IMAGE}:latest ."
            }
        }
        
        stage('Push Artifacts') {
            steps {
                echo "Pushing Docker image to Registry..."
                /* withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                    sh "docker push ${DOCKER_IMAGE}:${IMAGE_TAG}"
                    sh "docker push ${DOCKER_IMAGE}:latest"
                }
                */
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main' // Only deploy on main branch
            }
            steps {
                echo "Deploying application to Production server..."
                // In reality, this might be an SSH script, kubectl apply, or Helm chart deployment
                sh "docker-compose up -d" 
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline finished. Cleaning up...'
            // Clean up old images to save disk space on Jenkins worker
            // sh "docker rmi ${DOCKER_IMAGE}:${IMAGE_TAG} || true"
        }
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed. Sending notifications...'
        }
    }
}