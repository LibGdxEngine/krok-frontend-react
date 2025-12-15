import React, { useState } from "react";
import axiosInstance from "@/components/axiosInstance";
import {
    Check,
    Star,
    Zap,
    BookOpen,
    Users,
    Baby,
    Award,
    ArrowRight,
    Sparkles,
} from "lucide-react";
import NavbarContainer from "@/components/layout/NavbarContainer";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import SplashScreen from "@/components/common/SplashScreen";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function SubscriptionPlans() {
    const router = useRouter();
    const [billingCycle, setBillingCycle] = useState("monthly");
    const [hoveredPlan, setHoveredPlan] = useState(null);
    const [fetchedPlans, setFetchedPlans] = useState([]);

    const [loading, setLoading] = useState(true); // Start loading true
    const [error, setError] = useState(null);
    const { token, authLoading } = useAuth();

    // Fetch plans from backend
    React.useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axiosInstance.get("/v1/payments/plans/", {
                    headers: {
                        Authorization: token ? `Token ${token}` : undefined
                    }
                });
                setFetchedPlans(response.data);
            } catch (err) {
                console.error("Failed to fetch plans:", err);
                // Fallback or error handling
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchPlans();
        }
    }, [token, authLoading]);


    if (authLoading) {
        return <SplashScreen />;
    }

    const handleSubscribe = async (planId) => {
        if (!token) {
            toast.warning("You need to sing in first");
            router.push("/signin");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post("/v1/payments/create-subscription/", {
                plan_id: planId,
            },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            // redirect user to Stripe checkout
            window.location.href = response.data.checkout_url;
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };


    // Process fetched plans to group them
    const plans = React.useMemo(() => {
        const grouped = {};

        fetchedPlans.forEach(plan => {
            if (!grouped[plan.name]) {
                grouped[plan.name] = {
                    name: plan.name,
                    description: plan.description,
                    features: plan.features || [],
                    color: plan.color || "lightGreen",
                    iconName: plan.icon || "Baby",
                    popular: plan.popular || false,
                    monthlyPrice: 0,
                    yearlyPrice: 0,
                    monthlyPlanId: null,
                    yearlyPlanId: null
                };
            }

            if (plan.interval === 'month') {
                grouped[plan.name].monthlyPrice = parseFloat(plan.price);
                grouped[plan.name].monthlyPlanId = plan.id;
            } else if (plan.interval === 'year') {
                grouped[plan.name].yearlyPrice = parseFloat(plan.price);
                grouped[plan.name].yearlyPlanId = plan.id;
            }
        });

        // Icon mapping
        const iconMap = {
            "Baby": Baby,
            "BookOpen": BookOpen,
            "Zap": Zap,
            "Award": Award,
            // Add fallbacks
        };

        return Object.values(grouped).map(p => ({
            ...p,
            icon: iconMap[p.iconName] || Star // Default icon
        })).sort((a, b) => a.monthlyPrice - b.monthlyPrice); // Sort by price
    }, [fetchedPlans]);

    // Fallback if no plans fetched yet (or empty) to avoid breaking UI during loading or if empty
    if (plans.length === 0 && !loading && fetchedPlans.length === 0) {
        // Optionally render empty state or keep existing static as fallback?
        // For now let's assume if array is empty it just renders nothing or we can keep the static list as initial state if preferred.
        // But the requirement is to use backend plans. 
    }

    const savings = {
        Professional: Math.round(((79 * 12 - 790) / (79 * 12)) * 100),
        Enterprise: Math.round(((149 * 12 - 1490) / (149 * 12)) * 100),
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-mintyGreen via-white to-lightGray">
            <NavbarContainer with_search_bar={false} />
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-20 left-10 w-32 h-32 bg-lightGreen rounded-full opacity-20 animate-flow-0"></div>
                <div
                    className="absolute top-40 right-20 w-24 h-24 bg-greenCard rounded-full opacity-30 animate-flow-1"></div>
                <div
                    className="absolute bottom-32 left-1/4 w-40 h-40 bg-darkGreen rounded-full opacity-15 animate-flow-2"></div>
                <div
                    className="absolute bottom-20 right-1/3 w-28 h-28 bg-midGreen rounded-full opacity-25 animate-flow-3"></div>
            </div>

            <div className="relative z-10  mx-auto px-4 py-16">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-gradient-to-r from-greenCard to-darkGreen rounded-full shadow-6">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold font-Poppins mb-6 bg-gradient-to-r from-darkGreen via-midGreen to-greenCard bg-clip-text text-transparent">
                        Choose Your Learning Path
                    </h1>

                    <p className="text-xl text-mildGray max-w-3xl mx-auto mb-12 leading-relaxed">
                        Unlock unlimited potential with our comprehensive learning platform.
                        Select the perfect plan to accelerate your growth and achieve your
                        goals.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className=" grid grid-cols-4  md:grid-cols-1 gap-8 max-w-7xl mx-auto ">
                    {plans.map((plan, index) => {
                        const IconComponent = plan.icon;
                        const price = plan.monthlyPrice;
                        const isHovered = hoveredPlan === index;

                        return (
                            <div
                                key={plan.name}
                                onMouseEnter={() => setHoveredPlan(index)}
                                onMouseLeave={() => setHoveredPlan(null)}
                                className={` flex flex-col items-center justify-between  relative bg-white rounded-35 p-8 transition-all duration-500 hover:scale-105 ${plan.popular
                                    ? "shadow-6 border-2 border-greenCard"
                                    : "shadow-2 hover:shadow-5"
                                    } ${isHovered ? "transform -translate-y-2" : ""}`}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div
                                            className="bg-gradient-to-r from-greenCard to-darkGreen text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span>Best Deal</span>
                                        </div>
                                    </div>
                                )}

                                {/* Plan Header */}
                                <div className="text-center mb-8">
                                    <div
                                        className={`inline-flex p-4 rounded-full mb-4 ${plan.color === "lightGreen"
                                            ? "bg-lightGreen"
                                            : plan.color === "greenCard"
                                                ? "bg-greenCard"
                                                : "bg-darkGreen"
                                            }`}
                                    >
                                        <IconComponent
                                            className={`w-8 h-8 ${plan.color === "lightGreen"
                                                ? "text-darkGreen"
                                                : "text-white"
                                                }`}
                                        />
                                    </div>

                                    <h3 className="text-2xl font-bold font-Poppins text-primary mb-2">
                                        {plan.name}
                                    </h3>
                                    <p className="text-mildGray text-sm leading-relaxed">
                                        {plan.description}
                                    </p>
                                </div>

                                {/* Pricing */}
                                <div className="text-center mb-8">
                                    <div className="flex items-baseline justify-center mb-2">
                                        <span className="text-5xl font-bold font-Poppins text-darkGreen">
                                            €{price}
                                        </span>
                                    </div>

                                    {billingCycle === "yearly" && plan.name !== "Starter" && (
                                        <div className="text-sm text-greenCard font-medium">
                                            Save {savings[plan.name]}% annually
                                        </div>
                                    )}
                                </div>

                                {/* Features */}
                                <div className="space-y-4 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <div
                                            key={featureIndex}
                                            className="flex items-start space-x-3"
                                        >
                                            <div
                                                className="flex-shrink-0 w-5 h-5 bg-lightGreen rounded-full flex items-center justify-center mt-0.5">
                                                <Check className="w-3 h-3 text-darkGreen" />
                                            </div>
                                            <span className="text-black text-sm leading-relaxed">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <button
                                    onClick={() => {
                                        const planId = billingCycle === 'monthly' ? plan.monthlyPlanId : plan.yearlyPlanId;
                                        if (planId) handleSubscribe(planId);
                                    }}
                                    className={`w-full ${index === 0 ? "hidden" : ""} py-4 px-6 rounded-35 font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${plan.popular
                                        ? "bg-gradient-to-r from-greenCard to-darkGreen text-white shadow-6 hover:shadow-7"
                                        : "bg-lightGreen text-darkGreen hover:bg-greenCard hover:text-white shadow-2 hover:shadow-5"
                                        }`}
                                >
                                    <span>Get Started</span>
                                    <ArrowRight
                                        className={`w-5 h-5 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""
                                            }`}
                                    />
                                </button>

                                {/* Money Back Guarantee */}
                                <div className="text-center mt-4">
                                    <span className="text-2xs text-mildGray">
                                        {/*30-day money-back guarantee*/}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Section */}
                {/* <div className="text-center mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-35 p-8 shadow-2">
            <div className="flex items-center justify-center space-x-8 mb-6">
              <div className="flex items-center space-x-2">
                <Users className="w-6 h-6 text-greenCard" />
                <span className="text-lg font-semibold text-primary">
                  10M+ Students
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-greenCard" />
                <span className="text-lg font-semibold text-primary">
                  1000+ Courses
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-greenCard" />
                <span className="text-lg font-semibold text-primary">
                  Expert Instructors
                </span>
              </div>
            </div>

            <p className="text-mildGray leading-relaxed mb-6">
              Join millions of learners worldwide who trust our platform to
              advance their careers and achieve their learning goals. Start your
              journey today with a risk-free trial.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-greenCard to-darkGreen text-white rounded-35 font-semibold hover:shadow-6 transition-all duration-300 transform hover:scale-105">
                Start Free Trial
              </button>
              <button className="px-6 py-3 border-2 border-greenCard text-greenCard rounded-35 font-semibold hover:bg-greenCard hover:text-white transition-all duration-300">
                View All Features
              </button>
            </div>
          </div>
        </div> */}
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />

            </div>
        </div>
    );
}
