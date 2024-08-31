'use client';


import React from 'react';
import ConnectButton from '@/components/ConnectButton';
import Link from 'next/link';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
  

// interface Page = {
type Page = {
    title: string;
    href: string;
};

// const pages = ['Marketplace', 'My NFT', 'NFT creation'];
const pages: Page[] = [
    {
        title: "Marketplace",
        href: "/marketplace"
    },
    {
        title: "My NFT",
        href: "/my-nft"
    },
    {
        title: "NFT creation",
        href: "/nft-creation"
    },
    {
        title: "Redeem NFT",
        href: "/redeem"
    },
]


export default function NavMenu() {
  return (
    <>
        <nav className="w-full border-0 py-2 sm:py-3 md:py-4 lg:py-5 px-3 sm:px-6 md:px-12 lg:px-24 bg-gray-950 items-center justify-between">
            <div className='flex items-center justify-between w-full'>
                <div className="w-full flex-1 md:flex">
                    <NavigationMenu enableFlex={false} className="w-full flex-1">
                        <NavigationMenuList className="w-full flex justify-end md:justify-between flex-nowrap space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-8">
                            {pages.map((page) => (
                                <NavigationMenuItem key={page.title} className="hidden md:flex md:flex-1 w-full my-1 sm:my-2 md:my-3 lg:my-4">
                                    <Link href={page.href} legacyBehavior passHref>
                                        <NavigationMenuLink className={`${navigationMenuTriggerStyle()} w-full`}>
                                            {page.title}
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            ))}
                            <NavigationMenuItem key={"connect-button"} className="md:w-full md:flex-1 my-1 sm:my-2 md:my-3 lg:my-4">
                                <ConnectButton />
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
            <div className="relative w-full">
                <div className="fixed bottom-0 left-0 w-full z-50 md:hidden" >
                    <nav className="w-full border-0 py-2 sm:py-3 md:py-4 lg:py-5 px-3 sm:px-6 md:px-12 lg:px-24 bg-gray-950 items-center justify-between">
                        <NavigationMenu enableFlex={false}>
                            <NavigationMenuList className="w-full flex justify-between flex-nowrap space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-8">
                                {pages.map((page) => (
                                    <NavigationMenuItem key={page.title} className="w-full flex-1 my-1 sm:my-2 md:my-3 lg:my-4">
                                        <Link href={page.href} legacyBehavior passHref>
                                            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} w-full`}>
                                                {page.title}
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </nav>
                </div>
            </div>
        </nav>
    </>
  );
}