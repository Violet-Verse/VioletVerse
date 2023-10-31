import "../styles/Enterprise.module.css";
import Card from "./card";
const EnterpriseFeatures = () => {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black">
            <div className="container px-4 md:px-6">
                <div className="grid gap-6 items-center">
                    <div className="flex flex-col justify-center space-y-8 text-center">
                        <div className="space-y-2" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: "center"
                        }}>
                            <h1 style={{ margin: '0px 0px 0px 16%',color:"white"}}>
                                Discover Our Unique Features
                            </h1>
                            <p className="color" style={{
                                margin: '5% 15%',
                                fontFamily: 'stratos'
                            }}>
                                At Violet Verse, we&apos;ve meticulously crafted a suite of features that cater specifically to the intricate
                                 demands of the fashion media community. Our platform is a symphony of global diversity, heightened productivity,
                                  and streamlined workflows, all tailored to meet your unique needs.

                            </p>
                        </div>
                        <div className="w-full max-w-full space-y-4 mx-auto">
                            <div className="grid grid-cols-3 gap-8" style={{ display: "flex", justifyContent: 'space-between', }}>
                                <Card svg={(<svg
                                    className=" text-white h-6 w-6 mb-2 opacity-75"
                                    fill="none"
                                    height="24"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                                    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                                </svg>)}
                                    heading="Tailored Content Creation"
                                    para={[
                                        "Elevate your content creation with SEO optimization and tailor-made tools that empower your creativity.",
                                        "Paid and Free Content Discoverability System: Seamlessly switch between private and public access, giving you control over your content's visibility."
                                    ]}
                                />
                                <Card svg={(<svg
                                    className=" text-white h-6 w-6 mb-2 opacity-75"
                                    fill="none"
                                    height="24"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="m8 6 4-4 4 4" />
                                    <path d="M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22" />
                                    <path d="m20 22-5-5" />
                                </svg>)}
                                    heading="Engage and Expand Your Audience"
                                    para={[
                                        "Audience Community Hub: With just three clicks, your audience can register and immerse themselves in your community.",
                                        " Authenticated Membership Login: Ensure the authenticity of every individual engaging with your platform.",
                                        "Customizable Profiles: Let your members express their unique identities through customizable profiles."
                                    ]}
                                />
                                <Card svg={(<svg
                                    className=" text-white h-6 w-6 mb-2 opacity-75"
                                    fill="none"
                                    height="24"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>)}
                                    heading="Streamlined Monetization"
                                    para={[
                                        "Seamless Payment Integration: Effortlessly monetize your content and services through a secure and convenient payment gateway."
                                    ]}
                                />

                            </div>
                            <div className="grid grid-cols-3 gap-8" style={{ display: "flex", justifyContent: 'space-between', marginTop: "40px" }}>

                                <Card svg={(<svg
                                    className=" text-white h-6 w-6 mb-2 opacity-75"
                                    fill="none"
                                    height="24"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.3-4.3" />
                                </svg>)}
                                    heading="Effortless Communication"
                                    para={[
                                        "Text Messaging and Email Integration: Stay connected with your audience through text messages and emails, fostering engagement and communication."
                                    ]}
                                />
                                <Card svg={(<svg
                                    className=" text-white h-6 w-6 mb-2 opacity-75"
                                    fill="none"
                                    height="24"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>)}
                                    heading="Secure Content Distribution"
                                    para={[
                                        "Tokenization Digital Asset Distribution**: Protect your digital assets with state-of-the-art tokenization, ensuring secure and traceable distribution."
                                    ]}
                                />
                                <Card svg={(<svg
                                    className=" text-white h-6 w-6 mb-2 opacity-75"
                                    fill="none"
                                    height="24"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="m8 6 4-4 4 4" />
                                    <path d="M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22" />
                                    <path d="m20 22-5-5" />
                                </svg>)}
                                    heading="Immersive Experiences"
                                    para={[
                                        "AR/VR Integration: Elevate your content with cutting-edge Augmented Reality (AR) and Virtual Reality (VR) integration, offering immersive experiences like never before.",
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}
export default EnterpriseFeatures;