pipeline {
    agent any
    environment {
		tag="v1.0" //版本号
		projectName="${JOB_NAME}"
		commitHash="${GIT_COMMIT}"
    }
    stages {

		stage('生成Docker镜像') {
			steps {
				script {
                    dir('web/') {
                        echo "生成前端Docker镜像"
                        def pName = "${projectName}"
                        def list = pName.split('_')
                        dockerName = list[0]+"-web"
                        taget_image="${dockerName}:${tag}"
                        sh "docker build --build-arg app=${appName}-web -t ${taget_image} ."
                        sh "docker tag ${taget_image} ${registry_server}/${registry_project}/${dockerName}"
                        sh "docker tag ${taget_image} ${registry_server}/${registry_project}/${dockerName}:${commitHash}"
                    }   
                     dir('api/') {
                        echo "生成后端Docker镜像"
                        def pName = "${projectName}"
                        def list = pName.split('_')
                        dockerName =  list[0]+"-api"
                        taget_image="${dockerName}:${tag}"
                        sh "docker build --build-arg app=${appName}-api --no-cache --memory=4g  -t ${taget_image} ."
                        sh "docker tag ${taget_image} ${registry_server}/${registry_project}/${dockerName}"
                        sh "docker tag ${taget_image} ${registry_server}/${registry_project}/${dockerName}:${commitHash}"
                    }    
				}
			}
		}

        stage('上传镜像仓库') {
            steps {
                script {
                    docker_path="${WORKSPACE}"
                    echo "登录Harbor"
                    sh "cd ${docker_path}"
                    sh "docker login ${registry_server} -u ${registry_account} -p ${registry_password}"
                    echo "生成镜像并推送到Harbor"
                    def pName = "${projectName}"
                    def list = pName.split('_')
                    dockerName =  list[0]+"-web"
                    sh "docker push ${registry_server}/${registry_project}/${dockerName}:latest"
                    sh "docker push ${registry_server}/${registry_project}/${dockerName}:${commitHash}"
                    echo "删除本地镜像"
                    sh "docker rmi -f \$(docker images|grep ${dockerName}|grep ${tag}|awk '{print \$3}'|head -n 1)"
                    dockerName =  list[0]+"-api"
                    sh "docker push ${registry_server}/${registry_project}/${dockerName}:latest"
                    sh "docker push ${registry_server}/${registry_project}/${dockerName}:${commitHash}"
                    echo "删除本地镜像"
                    sh "docker rmi -f \$(docker images|grep ${dockerName}|grep ${tag}|awk '{print \$3}'|head -n 1)"
                }
            }
        }
        stage('Helm工具部署') {
		    steps {
				echo "部署到K8s"
				script {
					def pName = "${projectName}"
					def list = pName.split('_')
					dockerName = list[0]+"-web"
					sh "/usr/local/bin/helm repo update"
					    //sh "/usr/local/bin/helm install ${dockerName} mychart_d/${dockerName} --set commitHash=${commitHash} --kubeconfig ~/.kube/config"
					sh "/usr/local/bin/helm upgrade ${dockerName} mychart_d/${dockerName} --set commitHash=${commitHash} --kubeconfig ~/.kube/config"
                    dockerName = list[0]+"-api"
					// sh "/usr/local/bin/helm install ${dockerName} mychart_d/${dockerName} --set commitHash=${commitHash} --kubeconfig ~/.kube/config"
					sh "/usr/local/bin/helm upgrade ${dockerName} mychart_d/${dockerName} --set commitHash=${commitHash} --kubeconfig ~/.kube/config"
				}
			}
        }
    }
	post {             //新增
        success {
            emailext (
                subject: "项目构建成功: 任务 '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """
                      任务构建成功: 任务 '${env.JOB_NAME} [${env.BUILD_NUMBER}]':
                      Check console output at "${env.JOB_NAME} [${env.BUILD_NUMBER}]"
                      """,
                to: "93634776@qq.com",
                from: "93634776@qq.com"
            )


        }
        failure {
            emailext (
                subject: "项目构建失败: 任务 '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """
                      项目构建失败: 任务 '${env.JOB_NAME} [${env.BUILD_NUMBER}]':
                      Check console output at "${env.JOB_NAME} [${env.BUILD_NUMBER}]"
                      """,
                to: "93634776@qq.com",
                from: "93634776@qq.com"
            )
        }
    }
}
