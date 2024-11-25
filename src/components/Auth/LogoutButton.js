import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@aws-amplify/ui-react";

const LogoutButton = () => {
    const {logout, isAuthenticated} = useAuth0();

    return (
        isAuthenticated && (
            <Button onClick={() => logout()}>
                Sign Out
            </Button>

        )
    )
}

export default LogoutButton