pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'myregistry/ecommerce-catalog'
        IMAGE_TAG = "${env.BUILD_NUMBER}" // Versioning using build number
        // Credentials ID in Jenkins for Docker Registry
        DOCKER_CREDS_ID = 'dockerhub-credentials' 
        SCANNER_HOME = tool 'sonar-scanner'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'npm run lint'
            }
        }
        
        // SonarQube integration (Optional/Hypothetical)
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    // Running the scanner directly on JS files
                    sh "$SCANNER_HOME/bin/sonar-scanner \
                        -Dsonar.projectKey=nodejs-ecommerce \
                        -Dsonar.sources=. \
                        -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info"
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDS_ID}", passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    sh "docker build -t \$DOCKER_USER/node-app:${env.BUILD_NUMBER} ."
                    sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                    sh "docker push \$DOCKER_USER/node-app:${env.BUILD_NUMBER}"
                }
            }
        }
    }   
}
