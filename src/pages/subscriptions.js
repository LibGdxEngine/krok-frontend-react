import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import NavBar from "./components/NavBar";

export default function SubscriptionPage() {
  const subscriptions = [
    {
      title: "Basic",
      price: "$9.99",
      description: "Perfect for individuals and small projects",
      image: "/1.svg",
      features: [
        "Access to basic features",
        "1 user account",
        "5GB storage",
        "Email support",
        "Basic analytics",
      ],
      popular: false,
      buttonText: "Get Started",
    },
    {
      title: "Pro",
      price: "$19.99",
      description: "Ideal for professionals and growing teams",
      image: "/placeholder.svg?height=100&width=250",
      features: [
        "All Basic features",
        "5 user accounts",
        "25GB storage",
        "Priority email support",
        "Advanced analytics",
        "API access",
      ],
      popular: true,
      buttonText: "Upgrade to Pro",
    },
    {
      title: "Enterprise",
      price: "$49.99",
      description: "For large organizations with advanced needs",
      image: "/placeholder.svg?height=100&width=250",
      features: [
        "All Pro features",
        "Unlimited user accounts",
        "100GB storage",
        "24/7 phone & email support",
        "Custom analytics",
        "Dedicated account manager",
        "Custom integrations",
      ],
      popular: false,
      buttonText: "Contact Sales",
    },
  ];

  return (
    <>
      <NavBar />
      <div className="w-10/12 mx-auto py-12 px-6 md:px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl text-black font-bold tracking-tight sm:text-4xl md:text-3xl">
            Choose Your Plan
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Select the perfect subscription that fits your needs. Upgrade or
            downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-1 justify-between gap-8">
          {subscriptions.map((subscription, index) => (
            <div
              key={index}
              className={`flex flex-col rounded-lg border ${
                subscription.popular
                  ? "border-blue-500 shadow-lg"
                  : "border-gray-200"
              } overflow-hidden`}
            >
              <div className="p-6 pb-0 relative">
                <div className="relative w-full h-32 mb-4">
                  <Image
                    src={subscription.image || "/1.svg"}
                    alt={`${subscription.title} plan`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                {subscription.popular && (
                  <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold">{subscription.title}</h3>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl text-black font-bold">
                    {subscription.price}
                  </span>
                  <span className="ml-1 text-gray-500">/month</span>
                </div>
                <p className="mt-2 text-gray-500">{subscription.description}</p>
              </div>
              <div className="p-6 flex-grow">
                <ul className="space-y-2 mt-4">
                  {subscription.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="h-5 w-5 text-blue-500 shrink-0 mr-2"
                      />
                      <span className="text-black">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 pt-0">
                <button
                  className={`w-full py-2 px-4 rounded-md font-medium ${
                    subscription.popular
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
                  } transition-colors`}
                >
                  {subscription.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
