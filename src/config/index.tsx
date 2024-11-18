let HOST, BASE_URL, WS_SCHEME;

const scheme = {
  HTTP: "http://",
  HTTPS: "https://",
};

HOST = "balencer-IAP-1649378944.eu-north-1.elb.amazonaws.com:444";
BASE_URL = `${scheme.HTTPS}${HOST}`;

const config = {
    PRODUCTION: import.meta.env.PROD,
    HOST,
    BASE_URL,
    API_USER_URL: `${BASE_URL}/auth`,
    API_TASK_URL: `${BASE_URL}/tasks`,
};

export default config;