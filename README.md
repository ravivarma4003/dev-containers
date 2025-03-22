# Development Containers (Dev Containers)

This repository contains development container configurations that provide a consistent, reproducible, and isolated development environment using Docker containers.

## What are Dev Containers?

Development containers (or dev containers) are Docker containers specifically configured for development use. They allow you to:

- Create consistent development environments across different machines
- Isolate development dependencies from your local system
- Onboard new team members quickly with pre-configured environments
- Ensure everyone on the team is using the same tools, libraries, and versions

## Prerequisites

Before you can use these dev containers, you'll need to install:

1. **Docker Desktop**
   - [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
   - For Windows and macOS: Install Docker Desktop
   - For Linux: Install Docker Engine and Docker Compose

2. **Visual Studio Code**
   - [Download VS Code](https://code.visualstudio.com/)

3. **Remote - Containers Extension for VS Code**
   - Install from the VS Code Extensions Marketplace
   - Or run: `code --install-extension ms-vscode-remote.remote-containers`

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/dev-containers.git
   cd dev-containers
   ```

2. Open the project in VS Code:
   ```bash
   code .
   ```

3. When prompted, click "Reopen in Container" or:
   - Press `F1` or `Ctrl+Shift+P` (Windows/Linux) / `Cmd+Shift+P` (macOS)
   - Type "Remote-Containers: Reopen in Container"
   - Select the option

4. Wait for the container to build and start. VS Code will automatically connect to the container.

## Using Dev Containers

Once your project is open in a dev container:

- All terminal commands run inside the container
- Extensions are installed in the container
- File changes are synchronized between your local machine and the container
- The development environment is isolated from your local system

## Available Dev Containers

This repository includes the following dev container configurations:

- (List your available dev container configurations here)

## Customizing Dev Containers

You can customize the dev containers by modifying the `.devcontainer/devcontainer.json` file and the associated Dockerfile.

### Common Customizations:

- Installing additional tools and dependencies
- Configuring environment variables
- Setting up port forwarding
- Mounting additional volumes
- Configuring VS Code settings and extensions

## Troubleshooting

### Common Issues:

1. **Docker not running**
   - Ensure Docker Desktop is running before attempting to open a dev container

2. **Port conflicts**
   - If you encounter port conflicts, modify the port mappings in the `devcontainer.json` file

3. **Container build failures**
   - Check the Docker logs for more detailed error messages
   - Ensure you have a stable internet connection for downloading container images

4. **Performance issues**
   - On Windows/macOS, adjust the resources allocated to Docker in Docker Desktop settings

## Additional Resources

- [VS Code Dev Containers Documentation](https://code.visualstudio.com/docs/remote/containers)
- [Dev Container Specification](https://github.com/microsoft/vscode-dev-containers/tree/main/containers)
- [Docker Documentation](https://docs.docker.com/)

## License

(Add your license information here)
