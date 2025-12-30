"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

interface HeaderProps {
    user?: string
}

const Header = ({ user }: HeaderProps) => {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/logout", {
                method: "POST",
            })
            if (response.ok) {
                router.push("/login")
                router.refresh()
            }
        } catch (error) {
            console.error("Logout failed", error)
        }
    }

    return (
        <div className="flex items-center justify-between p-4 border-b">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link href="/">Home</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link href="/about">About</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link href="/contact">Contact</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    {user && (
                        <NavigationMenuItem>
                            <span className="px-4 py-2 text-sm text-muted-foreground mr-2">
                                {user}
                            </span>
                        </NavigationMenuItem>
                    )}
                    <NavigationMenuItem>
                        <button onClick={handleLogout} className={navigationMenuTriggerStyle()}>
                            Logout
                        </button>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

export default Header
