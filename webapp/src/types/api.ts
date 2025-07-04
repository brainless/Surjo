// Generated from OpenAPI schema - do not edit manually
// Run 'pnpm generate-types' to regenerate

export interface paths {
  "/api/hello": {
    get: operations["hello_world"];
  };
  "/api/users": {
    post: operations["create_user"];
  };
  "/api/users/{id}": {
    get: operations["get_user"];
    put: operations["update_user"];
  };
  "/api/auth/login": {
    post: operations["login"];
  };
  "/api/auth/google": {
    post: operations["google_auth"];
  };
}

export interface components {
  schemas: {
    CreateUserRequest: {
      email: string;
      password: string;
      first_name?: string | null;
      last_name?: string | null;
    };
    GoogleAuthRequest: {
      code: string;
    };
    HelloWorldResponse: {
      message: string;
      server_time: string;
      load_data: components["schemas"]["LoadData"];
    };
    LoadData: {
      cpu_usage: number;
      memory_usage: number;
      disk_usage: number;
    };
    LoginRequest: {
      email: string;
      password: string;
    };
    LoginResponse: {
      token: string;
      user: components["schemas"]["UserResponse"];
    };
    UpdateUserRequest: {
      first_name?: string | null;
      last_name?: string | null;
    };
    UserResponse: {
      id: string;
      email: string;
      first_name?: string | null;
      last_name?: string | null;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
  };
}

export interface operations {
  hello_world: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["HelloWorldResponse"];
        };
      };
    };
  };
  create_user: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateUserRequest"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["UserResponse"];
        };
      };
    };
  };
  get_user: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["UserResponse"];
        };
      };
    };
  };
  update_user: {
    parameters: {
      path: {
        id: string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateUserRequest"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["UserResponse"];
        };
      };
    };
  };
  login: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["LoginRequest"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["LoginResponse"];
        };
      };
    };
  };
  google_auth: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["GoogleAuthRequest"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["LoginResponse"];
        };
      };
    };
  };
}