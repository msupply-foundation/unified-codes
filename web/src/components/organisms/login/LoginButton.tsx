import * as React from 'react';
import { styled } from '@material-ui/core/styles';

import { Container } from '../../atoms';
import { Button } from '../../atoms';

import { flexColumnStyle } from "../../../styles";

export interface LoginButtonProps {};

export type LoginButton = React.FunctionComponent<LoginButtonProps>;

type User = {
    name: string,
    token: string
}
const adminUser: User = {
    name: 'Admin',
    token: 'AAAA0000_0000ZZZZ'
}

export const LoginButton: LoginButton = () => {
    const [user, setUser] = React.useState<User>();

    const onLogin = React.useCallback(() => { 
        localStorage.setItem('token', adminUser.token);
        setUser(adminUser); 
    }, []);
    const onLogout = React.useCallback(() => { setUser(undefined); }, []);

    const FlexContainer = React.useMemo(() => styled(({ ...props }) => <Container {...props}/>)(styles.flexContainer), []);
    
    return (
        <FlexContainer>
            { user 
                ? <Button onClick={onLogout}>{`Sign out ${user.name}`}</Button>
                : <Button onClick={onLogin} >Sign In</Button>
            }
        </FlexContainer>
    )
}

const styles = {
    flexContainer: flexColumnStyle,
};