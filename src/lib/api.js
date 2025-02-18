export async function fetchUsers() {
    const headers = JSON.parse(localStorage.getItem('headers'));
    try {
      const response = await fetch(
        "https://slack-api.replit.app/api/v1/users",
        {
          headers: {
            "Content-type": "application/json",
            ...headers,
          },
        }
      );
      const data = await response.json();
    //   if(data.hasOwnProperty('errors')){
    //       if(data.errors[0] === "You need to sign in or sign up before continuing."){
    //       localStorage.clear();
    //       navigate('/login');
    //     }
    //   }
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  export async function fetchUserChannels() {
    const headers = JSON.parse(localStorage.getItem('headers'));
    try {
      const response = await fetch(
        "https://slack-api.replit.app/api/v1/channels",
        {
          headers: {
            "Content-type": "application/json",
            ...headers,
          },
        }
      );
      const data = await response.json();
    //   if(data.hasOwnProperty('errors')){
    //     if(data.errors[0] === "You need to sign in or sign up before continuing."){
    //     localStorage.clear();
    //     navigate('/login');
    //   }
    // }
      return data;
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  }