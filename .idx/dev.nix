{ pkgs, ... }: {
  channel = "unstable";
  packages = [
    pkgs.nodejs_20
    pkgs.nodePackages.npm
  ];
  env = {};
  idx = {
    extensions = [
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
    ];
    workspace = {
      onCreate = {
        install-dependencies = "npm install";
      };
    };
    previews = {
      enable = true;
      previews = {
        web = {
          # The web preview manager automatically injects the PORT environment
          # variable, which the application is already configured to use.
          command = ["npm" "run" "dev"];
          manager = "web";
        };
      };
    };
  };
}
