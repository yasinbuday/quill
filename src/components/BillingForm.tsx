"use client"
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Button } from "./ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

const BillingForm = () => {
    return (
        <MaxWidthWrapper className="max-w-5xl">
            <form className="mt-12">
                <Card>
                    <CardHeader>
                        <CardTitle>Subscription Plan</CardTitle>
                        <CardDescription>
                            You are currently on the <strong className="text-purple-700">Free</strong> plan.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
                        <Button type="submit">
                            Upgrade to PRO
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </MaxWidthWrapper>

    /* If you are subscribed button says "Manage Subscription" and there is a date that shows when it renews or canceled  */
    );
};

export default BillingForm;
