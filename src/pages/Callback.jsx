import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Callback() {
    const navigate = useNavigate();
    useEffect(() => {
        console.log("Callback mounted ✅");
        const code = new URLSearchParams(window.location.search).get("code");
        console.log("Received code:", code);

        
        setTimeout(() => navigate("/"), 2000);
    }, [navigate]);
    useEffect(() => {
        const exchangeCode = async () => {
            const code = new URLSearchParams(window.location.search).get("code");

            if (!code) {
                console.error("No authorization code in URL");
                return;
            }

         
            const domain = import.meta.env.VITE_AWS_DOMAIN;
            const clientId = import.meta.env.VITE_CLIENT_ID;
            const redirectUri =
                window.location.hostname === "localhost"
                    ? import.meta.env.VITE_REDIRECT_LOCAL
                    : import.meta.env.VITE_REDIRECT_LIVE;

            const tokenParams = new URLSearchParams({
                grant_type: "authorization_code",
                client_id: clientId,
                redirect_uri: redirectUri,
                code,
            });

            try {
                const res = await fetch(`${domain}/oauth2/token`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: tokenParams.toString(),
                });
                

                const data = await res.json();

                if (!data.id_token) {
                    console.error("Token exchange failed:", data);
                    return;
                }

              
                localStorage.setItem("id_token", data.id_token);
                localStorage.setItem("access_token", data.access_token);
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/api/Profile/SaveOrCheckPlayerDetails`,
                    {},
                    { headers: { Authorization: `Bearer ${data.id_token}` } }
                );
                

                console.log("POS",response)
               
                navigate("/");
            } catch (err) {
                console.error("Error exchanging code:", err);
            }
        };

        exchangeCode();
    }, [navigate]);

    return (
        <main style={{ padding: "2rem", textAlign: "center" }}>
            <h1>Signing you in...</h1>
        </main>
    );
}
