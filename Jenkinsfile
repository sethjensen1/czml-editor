pipeline {
  agent any
    stages {
      stage('Build image') {
        steps {
          echo 'Starting to build docker image'

            script {
              def customImage = docker.build("endpoint/czml-editor:${env.BUILD_ID}")
                customImage.push()
            }
        }
      }
    }
}
