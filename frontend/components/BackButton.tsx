'use client'

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"


const BackButton: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Button onClick={handleGoBack}>
      Back
    </Button>
  );
};

export default BackButton;
