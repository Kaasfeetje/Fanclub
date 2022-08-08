import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const Header = () => {
    const { data } = useSession();

    return (
        <header>
            <nav>
                <ul>
                    {!data ? (
                        <>
                            <li>
                                <button onClick={() => signIn()}>Login</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <button onClick={() => signOut()}>
                                    Sign out
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
