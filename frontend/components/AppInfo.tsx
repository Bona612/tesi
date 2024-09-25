"use client";


import React from "react";
import { Button } from "@/components/ui/button";


export default function AppInfo() {

    const handleGitHubClick = () => {
        window.open("https://github.com/Bona612/tesi", "_blank");
    };

    const handleWokwiClick = () => {
        window.open("https://wokwi.com/projects/408504547254311937", "_blank");
    };


    return (
        <div className="flex flex-col items-center justify-center h-auto pt-2 sm:pt-3 md:pt-4 lg:pt-6">
            <div className="w-full my-2 sm:my-3 md:my-4 lg:my-6 text-center">
                <p className="text-lg sm:text-base md:text-lg xl:text-xl">
                    <strong>GitHub repository: </strong>
                </p>
                <a 
                    href="https://github.com/Bona612/tesi" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    <Button 
                        variant="link" 
                        className="text-xs sm:text-sm md:text-base xl:text-lg w-full max-w-[90%] mx-auto"
                    >
                        https://github.com/Bona612/tesi
                    </Button>
                </a>
            </div>
            <div className="w-full my-2 sm:my-3 md:my-4 lg:my-6 text-center">
                <p className="text-lg sm:text-base md:text-lg xl:text-xl mt-4">
                  <strong>Wokwi project: </strong>
                </p>
                <a 
                    href="https://wokwi.com/projects/408504547254311937" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    <Button 
                        variant="link" 
                        className="text-xs sm:text-sm md:text-base xl:text-lg w-full max-w-[90%] mx-auto"
                    >
                        https://wokwi.com/projects/408504547254311937
                    </Button>
                </a>
            </div>
            {/* <div className="w-full my-2 sm:my-3 md:my-4 lg:my-6 text-center">
                <p className="text-lg sm:text-base md:text-lg xl:text-xl mt-4">
                  <strong>Wokwi project: </strong>
                </p>
                <a 
                    href="https://wokwi.com/projects/408504547254311937" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    <Button 
                        variant="link" 
                        className="text-xs sm:text-sm md:text-base xl:text-lg w-full max-w-[90%] mx-auto"
                    >
                        https://wokwi.com/projects/408504547254311937
                    </Button>
                </a>
            </div> */}
        </div>
    );
}


