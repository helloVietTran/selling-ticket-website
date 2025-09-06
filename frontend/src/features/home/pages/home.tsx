import Footer from "@/components/footer";
import Header from "@/components/header";
import Navigation from "@/features/home/components/navigation";
import HomeLayout from "@/layouts/home-layout";

export default function Home() {

    return (
        <HomeLayout>

            <Header />
            <Navigation />

            <Footer />
        </HomeLayout>
    );
}
