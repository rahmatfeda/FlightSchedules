#!groovy

def kubectlTest() {
    // Test that kubectl can correctly communication with the Kubernetes API
    echo "running kubectl test"
    sh "kubectl get nodes"

}



def helmLint(String chart_dir) {
    // lint helm chart
    sh "/usr/bin/helm lint ${chart_dir}"

}


def helmDryrun(Map args) {

    println "Running dry run deployment"

    sh "/usr/bin/helm upgrade --dry-run --debug --install ${args.name} ${args.chart} --set image.tag=${args.tag},env=${args.env},image.repository=${args.repository},ingress.enabled=true,limits.cpu=${args.cpu},limits.memory=${args.memory},ingress.hostname=${args.hostname}"
}

def helmDeploy(Map args) {
    //configure helm client and confirm tiller process is installed

        println "Running deployment"
        sh "/usr/bin/helm upgrade --install ${args.name} ${args.chart} --set image.tag=${args.tag},env=${args.env},image.repository=${args.repository},ingress.enabled=true,limits.cpu=${args.cpu},limits.memory=${args.memory},ingress.hostname=${args.hostname}"

        echo "Application ${args.name} successfully deployed. Use helm status ${args.name} to check"
    }





node {
    
    // Setup the Docker Registry (Docker Hub) + Credentials 
    registry_url = "https://index.docker.io/v1/" // Docker Hub
    docker_creds_id = "Fedayizada-DockerHub" // name of the Jenkins Credentials ID
    build_tag = "1.0" // default tag to push for to the registry
    
    def pwd = pwd()
    def chart_dir = "${pwd}/charts/schedules"
        
    stage 'Checking out GitHub Repo'
    git credentialsId: 'github', url: 'https://github.com/rahmatfeda/FlightSchedules.git'
    
    def inputFile = readFile('config.json')
    def config = new groovy.json.JsonSlurperClassic().parseText(inputFile)
    println "pipeline config ==> ${config}"
    
    stage 'Building Container Container for Docker Hub'
    docker.withRegistry("${registry_url}", "${docker_creds_id}") {
    
        // Set up the container to build 
        container_registry = "fedayizada"
        container_name = "schedules"
        

        stage "Building"
        echo "Building Schedule with docker.build(${container_registry}/${container_name}:${build_tag})"
        container = docker.build("${container_registry}/${container_name}:${build_tag}", '.')
            
            // Start Testing
            stage "Running Container container"
            
            // Run the container with the env file, mounted volumes and the ports:
            docker.image("${container_registry}/${container_name}:${build_tag}").withRun("--name=${container_name}  -p 80:3000 ")  { c ->
                   
               
                //
                waitUntil {
                    sh "ss -antup | grep 80 | grep LISTEN | wc -l | tr -d '\n' > /tmp/wait_results"
                    wait_results = readFile '/tmp/wait_results'

                    echo "Wait Results(${wait_results})"
                    if ("${wait_results}" == "1")
                    {
                        echo "Container is listening on port 80"
                        sh "rm -f /tmp/wait_results"
                        return true
                    }
                    else
                    {
                        echo "Container is not listening on port 80 yet"
                        return false
                    }
                } // end of waitUntil
                
                // At this point Container is running
                echo "Docker Container is running"
                input 'You can Check the running Docker Container on docker builder server now! Click process to the next stage!!'    
                
                
            }    
                   
                    
     
        
        stage "Pushing"
        input 'Do you approve Pushing?'
        container.push()
        
        currentBuild.result = 'SUCCESS'
        
    }


    stage ('helm test') {
        
    // run helm chart linter
      helmLint(chart_dir)

    // run dry-run helm chart installation
      helmDryrun(
        name          : config.app.name,
        chart         : chart_dir,
        env           : 'dev',
        tag           : build_tag,
        hostname      : config.app.hostname,
        replicas      : config.app.replicas,
        cpu           : config.app.cpu,
        memory        : config.app.memory,
        repository    : config.app.repository+'/'+container_name
       )

    }
    
    stage ('helm deploy') {
      
      // Deploy using Helm chart
      helmDeploy(
        name          : config.app.name,
        chart         : chart_dir,
        env           : 'dev',
        tag           : build_tag,
        hostname      : config.app.hostname,
        replicas      : config.app.replicas,
        cpu           : config.app.cpu,
        memory        : config.app.memory,
        repository    : config.app.repository+'/'+container_name
      )

    }
    
    }
