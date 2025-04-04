import dotenv from "dotenv";
dotenv.config();


interface LinkedInApiResponse {
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  geo: {
    full: string;
  };
  position: Array<{
    companyName: string;
  }>;
}

async function scrapeLinkedInProfile(url: string): Promise<{
  name: string | null;
  job_title: string | null;
  company: string | null;
  location: string | null;
  summary: string | null;
}> {
  try {
     if (!process.env.RAPID_API_KEY) {
       throw new Error("RAPID_API_KEY is not defined in environment variables");
     }
     
    console.log("Scraping LinkedIn profile:", url);
    const apiUrl = `https://linkedin-data-api.p.rapidapi.com/get-profile-data-by-url?url=${encodeURIComponent(
      url
    )}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "linkedin-data-api.p.rapidapi.com",
      },
    };

    const response = await fetch(apiUrl, options);
    const data: LinkedInApiResponse = await response.json();
    console.log("LinkedIn API response:", data);

    return {
      name:
        data.firstName && data.lastName
          ? `${data.firstName} ${data.lastName}`
          : null,
      job_title: data.headline || null,
      company: data.position?.[0]?.companyName || null,
      location: data.geo?.full || null,
      summary: data.summary || null,
    };
  } catch (error) {
    console.error("Error fetching LinkedIn profile:", error);
    return {
      name: null,
      job_title: null,
      company: null,
      location: null,
      summary: null,
    };
  }
}

export default scrapeLinkedInProfile;
