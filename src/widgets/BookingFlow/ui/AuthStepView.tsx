import { useState, useMemo } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { SignUpView } from "@widgets/AuthModal/ui/SignUpView";
import { SignInView } from "@widgets/AuthModal/ui/SignInView";
import { VerifyView } from "@widgets/AuthModal/ui/VerifyView";
import { SignInErrorView } from "@widgets/AuthModal/ui/SignInErrorView";
import { OTPErrorView } from "@widgets/AuthModal/ui/OTPErrorView";
import type { ViewType } from "@widgets/AuthModal/ui/types";
import { Button } from "@ui";

export type AuthStepViewProps = {
  onSuccess: () => void;
  onBackClick?: () => void;
  renderAsPage?: boolean;
};

export const AuthStepView = ({
  onSuccess,
  onBackClick,
  renderAsPage = false,
}: AuthStepViewProps) => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<ViewType>("signUp");
  const [verifyType, setVerifyType] = useState<ViewType>("signUp");
  const [payload, setPayload] = useState<any>(null);

  const handleViewChange = (view: ViewType, newPayload?: any) => {
    setActiveView(view);
    if (newPayload) {
      setPayload(newPayload);
    }
  };

  const handleSignUpSuccess = (newPayload: any) => {
    setVerifyType("signUp");
    setPayload(newPayload);
    setActiveView("verify");
  };

  const handleSignInSuccess = (newPayload: any) => {
    setVerifyType("signIn");
    setPayload(newPayload);
    setActiveView("verify");
  };

  const handleVerifySuccess = () => {
    onSuccess();
  };

  const ViewComponent = useMemo(() => {
    const ViewComponentMap = {
      signUp: () => (
        <SignUpView
          onSuccess={handleSignUpSuccess}
          onViewChange={handleViewChange}
          formData={payload?.formData || {}}
        />
      ),
      verify: () => (
        <VerifyView
          type={verifyType}
          payload={payload}
          onSuccess={handleVerifySuccess}
          onViewChange={handleViewChange}
        />
      ),
      signIn: () => (
        <SignInView
          onSuccess={handleSignInSuccess}
          onViewChange={handleViewChange}
          formData={payload?.formData || {}}
          isAlreadyRegistered={!!payload?.isAlreadyRegistered}
        />
      ),
      signInError: () => <SignInErrorView onViewChange={handleViewChange} />,
      otpError: () => <OTPErrorView />,
    };
    return ViewComponentMap[activeView];
  }, [activeView, verifyType, payload]);

  const showBackButton = ["signUp", "signIn", "verify", "signInError", "otpError"].includes(activeView);

  return (
    <Flex direction="column" justify="space-between" width="full" height="full">
      <Flex
        width="full"
        direction="column"
        maxWidth="500px"
        mx="auto"
        sx={{
          "&::-webkit-scrollbar": {
            width: "0",
          },
        }}
      >
        {ViewComponent()}
      </Flex>
    </Flex>
  );
};
