import axios from "axios";

const KEYCLOAK_URL = "http://keycloak-service-india-dev.apps.inholland.hcs-lab.nl/realms/karma-kebab-realm/protocol/openid-connect/token";
const CLIENT_ID = "karma-kebab-realm-client";

const authenticate = async (username, password) => {
  console.log("Sending request to Keycloak...");
  
  const data = new URLSearchParams();
  data.append("username", username);
  data.append("password", password);
  data.append("grant_type", "password");
  data.append("scope", "openid");
  data.append("client_id", CLIENT_ID);

  try {
    const response = await axios.post(KEYCLOAK_URL, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Check for roles, you might need to fetch them separately if Keycloak doesn't send them in the response
    const roles = await getRolesFromKeycloak(response.data.access_token);
    response.data.roles = roles; // Add roles to the response

    return response;
  } catch (error) {
    console.error("Error during Keycloak authentication:", error);
    throw error;
  }
};

// Function to get roles from Keycloak (this could depend on your Keycloak setup)
const getRolesFromKeycloak = async (access_token) => {
  try {
    const response = await axios.get(
      "http://keycloak-service-india-dev.apps.inholland.hcs-lab.nl/realms/karma-kebab-realm/protocol/openid-connect/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log("Roles from Keycloak:", response.data);
    return response.data.roles || [];
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
};

const getAccessToken = async (username, password) => {
  console.log("Sending request to Keycloak to get access token...");

  const data = new URLSearchParams();
  data.append("username", username);
  data.append("password", password);
  data.append("grant_type", "password");
  data.append("scope", "openid");
  data.append("client_id", CLIENT_ID);

  try {
    const response = await axios.post(KEYCLOAK_URL, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Return only the access token
    return response.data.access_token;
  } catch (error) {
    console.error("Error during Keycloak authentication:", error);
    throw error;
  }
};


export default {
  authenticate,
  getAccessToken
};
