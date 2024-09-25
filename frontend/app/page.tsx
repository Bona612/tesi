import React from "react";
import { Button } from "@/components/ui/button";
import AppInfo from "@/components/AppInfo";

export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';

export default function HomePage() {
    return (
        <div>
          <AppInfo/>
        </div>
    );
}
