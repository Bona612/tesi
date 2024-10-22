'use client';

import React, { useState, useEffect } from 'react';

import BackButton from '@/components/BackButton';


type TokenBarProps = {
  tokenId: string;
}


function TokenBar({tokenId}: TokenBarProps) {
  return (
    <div className="sub-bar">
        <BackButton />
        <h2 className="sub-bar-title">{tokenId}</h2>
    </div>
  );
}
export default TokenBar;