import { CreditCard, Check, Zap, Crown, Sparkles, Clock, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Subscription } from '@/types/settings';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SubscriptionTabProps {
  subscription: Subscription;
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    icon: Sparkles,
    features: ['Up to 50 closet items', '5 AI queries/month', 'Basic outfit suggestions', 'Community access'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    icon: Zap,
    popular: true,
    features: ['Unlimited closet items', '100 AI queries/month', 'Advanced styling suggestions', 'Priority support', 'Export calendars'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    icon: Crown,
    features: ['Everything in Premium', 'Unlimited AI queries', 'Personal stylist access', 'Custom color analysis', 'Early feature access'],
  },
];

export const SubscriptionTab = ({ subscription }: SubscriptionTabProps) => {
  const currentPlan = PLANS.find(p => p.id === subscription.plan) || PLANS[0];

  const handleUpgrade = (planId: string) => {
    toast.success(`Upgrade to ${planId} initiated!`);
  };

  const handleCancelSubscription = () => {
    toast.info('Subscription cancellation flow would open here.');
  };

  const aiUsagePercentage = (subscription.usage.aiQueriesUsed / subscription.usage.aiQueriesLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <currentPlan.icon className="h-5 w-5 text-primary" />
                {currentPlan.name} Plan
              </CardTitle>
              <CardDescription>
                {subscription.renewalDate && (
                  <>Renews on {format(new Date(subscription.renewalDate), 'MMMM d, yyyy')}</>
                )}
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">${subscription.price}</p>
              <p className="text-sm text-muted-foreground">/month</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {subscription.features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                {feature}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Usage This Month
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>AI Queries</span>
              <span className="font-medium">
                {subscription.usage.aiQueriesUsed} / {subscription.usage.aiQueriesLimit}
              </span>
            </div>
            <Progress value={aiUsagePercentage} className="h-2" />
            {aiUsagePercentage > 80 && (
              <p className="text-xs text-amber-600">
                You're approaching your limit. Consider upgrading for more queries.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between py-2 border-t">
            <span className="text-sm">Closet Items</span>
            <span className="font-medium">
              {subscription.usage.closetItems}
              {subscription.usage.closetItemsLimit && ` / ${subscription.usage.closetItemsLimit}`}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Plan Options */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Choose the plan that works best for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <div 
                key={plan.id}
                className={cn(
                  "relative p-4 rounded-lg border-2 transition-all",
                  plan.id === subscription.plan 
                    ? "border-primary bg-primary/5" 
                    : "border-muted hover:border-primary/50",
                  plan.popular && "ring-2 ring-primary ring-offset-2"
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <div className="text-center mb-4">
                  <plan.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="text-2xl font-bold mt-1">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                </div>
                <ul className="space-y-2 mb-4">
                  {plan.features.slice(0, 3).map((feature) => (
                    <li key={feature} className="text-xs flex items-start gap-2">
                      <Check className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={plan.id === subscription.plan ? "outline" : "default"}
                  className="w-full"
                  disabled={plan.id === subscription.plan}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {plan.id === subscription.plan ? 'Current Plan' : 'Upgrade'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subscription.paymentMethod ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{subscription.paymentMethod.type} •••• {subscription.paymentMethod.last4}</p>
                  <p className="text-sm text-muted-foreground">Expires 12/26</p>
                </div>
              </div>
              <Button variant="outline">Update</Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">No payment method on file</p>
              <Button>Add Payment Method</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {subscription.billingHistory.map((item, index) => (
              <div 
                key={index}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(item.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${item.amount.toFixed(2)}</p>
                  <Button variant="ghost" size="sm" className="text-xs h-auto p-0">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cancel Subscription */}
      {subscription.plan !== 'free' && (
        <Card className="border-destructive/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Cancel Subscription</p>
                <p className="text-sm text-muted-foreground">
                  You can cancel anytime. Your subscription will remain active until the end of the billing period.
                </p>
              </div>
              <Button variant="outline" onClick={handleCancelSubscription}>
                Cancel Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
