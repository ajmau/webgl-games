import { ReactNode } from "react"

interface Props {
    children: ReactNode;
}

export const BasicCard = ({ children }: Props ) => {
    return (
        <div className="bg-gray-700 p-10 rounded-xl shadow-lg w-full max-w-md">
            {children}
        </div>
    )
}