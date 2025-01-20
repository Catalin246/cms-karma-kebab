import axios from "axios";

const keycloak = new Keycloak({
  url: 'http://keycloak-route-india-dev.apps.inholland.hcs-lab.nl',
  realm: 'karma-kebab-realm',
  clientId: 'karma-kebab-cms',
});

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

    console.log("Response from Keycloak:", response.data);
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
      "https://keycloak-service-india-dev.apps.inholland.hcs-lab.nl/realms/karma-kebab-realm/protocol/openid-connect/userinfo",
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

// const getAccessToken = async (username, password) => {
//   console.log("Sending request to Keycloak to get access token...");

//   const data = new URLSearchParams();
//   data.append("username", username);
//   data.append("password", password);
//   data.append("grant_type", "password");
//   data.append("scope", "openid");
//   data.append("client_id", CLIENT_ID);

//   try {
//     const response = await axios.post(KEYCLOAK_URL, data, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });
    
//     console.log(response.data.access_token);
//     // Return only the access token
//     return response.data.access_token;
//   } catch (error) {
//     console.error("Error during Keycloak authentication:", error);
//     throw error;
//   }
// };

// const getAccessToken = async (username, password) => {
//   console.log("Sending getaccestoken request to Keycloak...");
  
//   const data = new URLSearchParams();
//   data.append("username", username);
//   data.append("password", password);
//   data.append("grant_type", "password");
//   data.append("scope", "openid");
//   data.append("client_id", CLIENT_ID);

//   try {
//     const response = await axios.post(KEYCLOAK_URL, data, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });

//     console.log(response.data.access_token);
//     return response.data.access_token
//   } catch (error) {
//     console.error("Error during Keycloak authentication for getaccesstoken:", error);
//     throw error;
//   }
// };

const logout = () => {
  console.log("Logging out and clearing user info...");
  // Clear user credentials from localStorage
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("roles");
};

export default {
  authenticate, logout
};
