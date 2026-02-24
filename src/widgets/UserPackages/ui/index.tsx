import { Box, Grid } from "@chakra-ui/react";
import { type LayoutProps, RequestsGroupStatus } from "./types";
import { Container, Heading, Tabs } from "@ui";
import { useUserRequestsManager } from "@widgets/UserPackages/hooks";
import { RequestCard } from "@widgets/UserPackages/ui/RequestCard";
import {
  CanceledTabEmptyState,
  IncompleteTabEmptyState,
  PastTabEmptyState,
  UpcomingTabEmptyState,
} from "@widgets/UserPackages/ui/EmptyStates.tsx";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { bookingContextAtom, isLateCheckoutAtom } from "@/modules/packages/store/store";
import { useEffect, useRef } from "react";
import { useLanguageNavigate } from "@/hooks/useLanguageNavigate";
import { RequestStatus, transformRequestToPackage } from "@entities/package";

export const UserPackages = () => {
  const { t } = useTranslation();
  const setIsLateCheckout = useSetRecoilState(isLateCheckoutAtom);
  const setBookingContext = useSetRecoilState(bookingContextAtom);
  const { navigateToBooking, navigateToPayment } = useLanguageNavigate();
  const hasNavigatedRef = useRef(false);
  const {
    activeRequests,
    pendingRequests,
    cancelledRequests,
    passedRequests,
    isLoadingRemainingPayment,
    currentRequestId,
    handleCancelClick,
    cancellingRequestId,
    tab,
    handleTabChange,
    isLoadingUserRequests,
    handleContinueClick,
    activeRequest,
    handleBookingFlowClose,
    activeRequestPackage,
    incompleteInitialView,
    isActiveRequestDraft,
    isLoadingActiveRequestPackage,
  } = useUserRequestsManager();

  useEffect(() => {
    if (activeRequest?.notes.isLateCheckout !== undefined) {
      setIsLateCheckout(activeRequest.notes.isLateCheckout);
    }
  }, [activeRequest?.notes.isLateCheckout, setIsLateCheckout]);

  useEffect(() => {
    if (!activeRequest) {
      hasNavigatedRef.current = false;
    }
  }, [activeRequest]);
  // When user already booked/reserved (no down payment) → go to payment page from step 1
  useEffect(() => {
    if (!activeRequest || hasNavigatedRef.current) return;

    const isNoDownPaymentBooked =
      activeRequest.status === RequestStatus.NotPaid ||
      activeRequest.status === RequestStatus.Reserved;

    if (isNoDownPaymentBooked) {
      const packageDetails =
        activeRequestPackage ?? transformRequestToPackage(activeRequest);
      hasNavigatedRef.current = true;
      navigateToPayment({
        state: {
          packageDetails,
          request: activeRequest,
          travelers: activeRequest.travelers
            ? {
                adults: activeRequest.travelers.map((t) => ({
                  firstName: t.firstName,
                  lastName: t.lastName,
                  dateOfBirth: t.dateOfBirth ?? "",
                })),
                children: [],
              }
            : undefined,
        },
      });
      handleBookingFlowClose();
      return;
    }

    // Draft or other → go to booking page when package is ready
    if (
      activeRequestPackage?.offerId &&
      !isLoadingActiveRequestPackage
    ) {
      hasNavigatedRef.current = true;
      setBookingContext({
        packageDetails: activeRequestPackage,
        childrenAges: activeRequest.notes?.childrenAges || [],
        initialView: incompleteInitialView,
        request: activeRequest,
        defaultTravelers: activeRequest.travelers
          ? {
              adults: activeRequest.travelers.map((t) => ({
                firstName: t.firstName,
                lastName: t.lastName,
                dateOfBirth: t.dateOfBirth,
              })),
              children: [],
            }
          : undefined,
        isBooked: !isActiveRequestDraft,
      });
      navigateToBooking();
      handleBookingFlowClose();
    }
  }, [
    activeRequest,
    activeRequestPackage,
    activeRequestPackage?.offerId,
    isLoadingActiveRequestPackage,
    incompleteInitialView,
    isActiveRequestDraft,
    setBookingContext,
    navigateToBooking,
    navigateToPayment,
    handleBookingFlowClose,
  ]);

  return (
    <Layout>
      <Heading size="sm-md">{t`myPackages`}</Heading>

      <Tabs
        labels={[t`upcoming`, t`incomplete`, t`past`, t`canceled`]}
        mt="10"
        index={tab}
        onChange={handleTabChange}
      >
        {!activeRequests?.length ? (
          <UpcomingTabEmptyState isLoading={isLoadingUserRequests} />
        ) : (
          <TabContentLayout>
            {activeRequests.map((request) => (
              <RequestCard
                request={request}
                key={request.id}
                onRemainingPaymentClick={(request) =>
                  navigateToPayment({
                    state: {
                      mode: "remainingOnly",
                      request,
                      packageDetails: transformRequestToPackage(request),
                    },
                  })
                }
                isLoadingRemainingPayment={
                  currentRequestId === request.id && isLoadingRemainingPayment
                }
                onCancelClick={handleCancelClick}
                status={RequestsGroupStatus.Upcoming}
                isLoadingContinue={
                  request.id === activeRequest?.id &&
                  isLoadingActiveRequestPackage
                }
                onContinueClick={handleContinueClick}
                cancellingRequestId={cancellingRequestId}
              />
            ))}
          </TabContentLayout>
        )}

        {!pendingRequests?.length ? (
          <IncompleteTabEmptyState isLoading={isLoadingUserRequests} />
        ) : (
          <TabContentLayout>
            {pendingRequests.map((request) => (
              <RequestCard
                request={request}
                key={request.id}
                onCancelClick={handleCancelClick}
                status={RequestsGroupStatus.Incomplete}
                onContinueClick={handleContinueClick}
                isLoadingContinue={
                  request.id === activeRequest?.id &&
                  isLoadingActiveRequestPackage
                }
                cancellingRequestId={cancellingRequestId}
              />
            ))}
          </TabContentLayout>
        )}

        {!passedRequests?.length ? (
          <PastTabEmptyState isLoading={isLoadingUserRequests} />
        ) : (
          <TabContentLayout>
            {passedRequests.map((request) => (
              <RequestCard
                request={request}
                key={request.id}
                status={RequestsGroupStatus.Past}
              />
            ))}
          </TabContentLayout>
        )}

        {!cancelledRequests?.length ? (
          <CanceledTabEmptyState isLoading={isLoadingUserRequests} />
        ) : (
          <TabContentLayout>
            {cancelledRequests.map((request) => (
              <RequestCard
                request={request}
                key={request.id}
                status={RequestsGroupStatus.Canceled}
              />
            ))}
          </TabContentLayout>
        )}
      </Tabs>
    </Layout>
  );
};

const TabContentLayout = ({ children }: LayoutProps) => (
  <Grid
    templateColumns={{
      base: "1fr",
      md: "repeat(4, minmax(240px, 1fr))",
    }}
    columnGap={{ base: 4, lg: 6 }}
    rowGap="4"
    justifyItems={{ base: "center", md: "stretch" }}
  >
    {children}
  </Grid>
);

const Layout = ({ children }: LayoutProps) => (
  <Box py={{ base: 6, md: 10 }}>
    <Container>{children}</Container>
  </Box>
);
