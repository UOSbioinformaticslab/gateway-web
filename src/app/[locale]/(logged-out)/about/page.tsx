import Banner from "@/components/Banner";
import Container from "@/components/Container";
import metaData from "@/utils/metadata";

export const metadata = metaData({
    title: "About",
    description: "",
});

const AboutPage = () => {
    return (
        <>
            <Container
                sx={{
                    background: "white",
                    px: { mobile: 3, tablet: 6, desktop: 8 },
                    py: { mobile: 4, tablet: 6 },
                    color: "#1E2A4A",
                    fontSize: 18,
                    lineHeight: 1.7,
                }}>
                <p>
                    <strong>The CRUK Pilot Data Hub</strong>
                    <br />
                    Authors: Sarah Wooller, Ayoola Olojede, Andrew Blake,
                    Joseph Day, Frances Pearl
                </p>
                <hr />

                <p>
                    In 2024 the Nobel Prize for Chemistry was awarded to the
                    AlphaFold team for their strides in protein folding. Whilst
                    this was an extraordinary feat it was one made possible by
                    the access that the teams had to standardized data on
                    protein structures in a common format, mandated by
                    publishing requirements.
                </p>

                <p>
                    Cancer research is increasingly evolving toward a
                    multidisciplinary approach, driven by the scale, diversity,
                    and sophistication of the available data, and by the
                    data-processing tools and infrastructure associated with
                    them. Yet finding and accessing cancer data remains
                    extremely challenging. In England alone there are 11
                    regional Secure Data Environments and over 100 Data
                    Custodians listed on the HDRUK&apos;s health data gateway.
                </p>

                <p>
                    Cancer Research UK is aiming to improve the reuse of data
                    funded by the charity, whilst continuing to put the patient
                    first. To do this it is focusing on implementing the FAIR
                    principles - making data that CRUK funds Findable,
                    Accessible, Interoperable, and Reusable - to accelerate the
                    translation of big data into patient benefits. The CRUK Data
                    Hub is central to this strategy.
                </p>

                <p>
                    The Pearl lab at the University of Sussex has teamed up
                    with CRUK to develop a metadata catalogue for their
                    research datasets. Using the enormous power of the HDRUK
                    health data gateway as a backend, we are giving it a new
                    look, focusing on what cancer researchers really need to
                    know about the datasets they are looking for:
                </p>

                <ul>
                    <li>Which cancers is the dataset focusing on?</li>
                    <li>What type of data does it contain?</li>
                    <li>What are the access conditions?</li>
                </ul>

                <p>
                    In addition, the datahub will provide rich metadata about
                    the datasets and link back to the health data gateway in
                    order to streamline the access process. At the same time,
                    we do not want to duplicate the HDRUK health data gateway
                    so all data uploaded to the CRUK data hub will also be
                    available through the gateway.
                </p>
            </Container>
        </>
    );
};

export default AboutPage;
