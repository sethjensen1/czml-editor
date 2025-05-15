pipeline {
  agent any

  environment {
    //REF_NAME = "${env.TAG_NAME ?: env.BRANCH_NAME}"
    REF_NAME = "latest"
  }
    stages {
      stage('Build image') {
        steps {
          echo 'Starting to build the docker image'

            script {
              def customImage = docker.build("endpoint/czml-editor:${env.REF_NAME}")
                customImage.push()
            }
        }
      }
    }
}
