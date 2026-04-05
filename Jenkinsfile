pipeline {
    agent any

    tools {
        jdk 'jdk21'
        nodejs 'node20'
    }

    environment {
        NEXUS_URL = "http://3.110.51.8:8081/repository/e-commerce/"
        SONAR_PROJECT_KEY = "E-commerce"
        DOCKERHUB_USERNAME = 'parte15'
        DOCKER_IMAGE = "${DOCKERHUB_USERNAME}/ecommerce-catalog"
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
                        -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
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
                script {
                    def app = docker.build("${DOCKER_IMAGE}:${env.BUILD_ID}")
                    docker.withRegistry('https://index.docker.io/v1/', 'DOCKER_CREDS_ID') {
                        app.push()
                        app.push('latest')
                    }
                }
            }
        }
    }   
}
