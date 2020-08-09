import * as React from "react";

import { Dialog, DialogContent, LoginForm } from "@unified-codes/ui";

export const Login = () => {
    const [isOpen, setIsOpen] = React.useState<boolean>(true);
    const closeDialog = React.useCallback(() => setIsOpen(false), []);
    const onSubmit = React.useCallback((username, password) => {
        alert(`Submitted ${username}: ${password}`);
        closeDialog();
    }, []);
    return (
        <Dialog open={isOpen} onClose={closeDialog}>
            <DialogContent dividers>
            <LoginForm onSubmit={onSubmit}/>
            </DialogContent>
        </Dialog>
    );
}

export default Login;
