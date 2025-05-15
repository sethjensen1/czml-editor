pipeline {
  agent any
    stages {
      stage('Build image') {
        steps {
          echo 'Starting to build the docker image'

            script {
              def customImage = docker.build("endpoint/czml-editor:${env.BRANCH_NAME}")
                customImage.push()
            }
        }
      }
    }
}
