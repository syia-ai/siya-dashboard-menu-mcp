declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      ENV_FILE?: string;
      LOG_LEVEL?: string;
      GITHUB_TOKEN?: string;
      GITHUB_OWNER?: string;
      GITHUB_REPO?: string;
      GITHUB_CONFIG_PATH?: string;
    }

    interface Process {
      env: ProcessEnv;
      argv: string[];
      exit(code?: number): never;
      on(event: string, listener: (...args: any[]) => void): this;
    }
  }

  var process: NodeJS.Process;
  var Buffer: {
    from(data: string, encoding?: string): {
      toString(encoding?: string): string;
    };
  };
}

export {};