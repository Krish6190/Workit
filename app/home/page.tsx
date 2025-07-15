"use client"
import NavigationBar from "../navigation"
import { useDelayedNavigation } from "../hooks/useDelayedNavigation";

export default function FirstPage() {
    const { navigateWithDelay } = useDelayedNavigation();
    return (
        <div className="about">
        <NavigationBar/>
            <main className="about-page">
                <section style={{ marginBottom: "2rem" }}>
                    <h1>About Workit</h1>
                    <p>
                        <strong>Workit</strong> is a modern platform built to empower your fitness journey. Our goal is to make calorie management, workout tracking, and health optimization simple and intuitive, so you can focus on making progress.
                    </p>
                </section>

                <section style={{ marginBottom: "2rem" }}>
                    <h2>Features You Get as a Signed-In User</h2>
                    <ul style={{ marginLeft: 20 }}>
                        <li>
                            <strong>Personalized Calorie Burn Calculator:</strong> Get instant insights based on your stats, activity, and goals.
                        </li>
                        <li>
                            <strong>Secure, Private Data:</strong> Your fitness journey and stats are saved just for you.
                        </li>
                        <li>
                            <strong>Clean, Responsive Design:</strong> Enjoy a seamless experience on desktop or mobile.
                        </li>
                        <li>
                            <strong>Easy Navigation:</strong> Move quickly between the calorie calculator, your profile, and more.
                        </li>
                        <li>
                            <strong>Motivational Features:</strong> Watch your progress and stay on track with easy-to-understand stats.
                        </li>
                    </ul>
                </section>

                <section style={{ marginBottom: "2rem" }}>
                    <h2>How Workit Works</h2>
                    <ol style={{ marginLeft: 20 }}>
                        <li>
                            <strong>Create Your Secure Account:</strong> Registration is fast, and your password is encrypted.
                        </li>
                        <li>
                            <strong>Input Your Details:</strong> Set your age, weight, height, and activity level.
                        </li>
                        <li>
                            <strong>Get Real-Time Results:</strong> Instantly see how everyday activity burns calories and what you need to reach your goals.
                        </li>
                        <li>
                            <strong>Track & Optimize:</strong> As a signed-in user, your progress and insights stay with you.
                        </li>
                    </ol>
                </section>

                <section>
                    <h2>Need Help or Want to Learn More?</h2>
                    <p>
                        Visit your <a href="#" onClick={(e) => { e.preventDefault(); navigateWithDelay("/profile"); }}>profile</a> to update your stats.
                    </p>
                </section>
            </main>
        </div>
    )
}