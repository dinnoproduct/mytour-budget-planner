"use client"

import React from "react";
import { UserPackages } from "@widgets/UserPackages";
import { PageLayout } from "@/shared/ui/layout/PageLayout";

export const MyPackagesPage = () => (
  <PageLayout>
    <UserPackages />
  </PageLayout>
);
