import { Box, Typography } from "@mui/material";

export default function ManagingCollectionsContent() {
    return (
        <Box
            sx={{
                maxWidth: 800,
                mx: "auto",
                textAlign: "left",
                color: "grey.900",
                lineHeight: 1.8,
                fontSize: 16,
            }}>
            <Typography component="h2" variant="h2" sx={{ fontSize: 22, mb: 1, mt: 2 }}>
                Introduction to Collections
            </Typography>
            <Typography component="p" sx={{ mb: 2 }}>
                Collections are curated lists of resources (Datasets, Analysis Scripts &amp;
                Software, Data Uses / Research Projects and Publications) around a particular topic,
                theme, or Team. Types of Collections may include resources related to a research
                domain, research hub, or research project. Collections can be managed by Data
                Custodian Teams or by individual (registered) Cancer Data Hub Users.
            </Typography>

            <Typography component="h2" variant="h2" sx={{ fontSize: 22, mb: 1, mt: 2 }}>
                Collections in the Cancer Data Hub
            </Typography>
            <Typography component="p" sx={{ mb: 2 }}>
                To view, add, edit, or archive a Collection, navigate to the Collections section
                within your Team Management dashboard or personal profile.
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                <li>
                    <strong>Adding a New Collection:</strong> Select the &apos;+ Add new
                    Collection&apos; button. A Collection requires a name, Description, and Logo.
                </li>
                <li>
                    <strong>Add Related Resources:</strong> Link existing Cancer Data Hub resources
                    (Datasets, Data Uses / Research Projects, Publications, Analysis Scripts &amp;
                    Software) via the &apos;Add resource&apos; button. Remove using the remove icon.
                    Save as draft or Publish.
                </li>
                <li>
                    <strong>Edit/Archive Collection:</strong> Use the edit or archive icons as
                    needed.
                </li>
            </Box>

            <Typography component="h2" variant="h2" sx={{ fontSize: 22, mb: 1, mt: 2 }}>
                Data Custodian Pages
            </Typography>
            <Typography component="p" sx={{ mb: 2 }}>
                Each Data Custodian Team has its own Data Custodian Page displaying aliases, active
                Datasets, Analysis Scripts &amp; Software, Data Uses / Research Projects, and
                Publications. These pages update automatically when new resources are added.
            </Typography>
            <Typography component="p" sx={{ mb: 2 }}>
                Registered users can make enquiries directly to a Data Custodian from the page.
                From the homepage, select the Data Custodians tile or via Search → Data Custodians.
            </Typography>

            <Typography component="h2" variant="h2" sx={{ fontSize: 22, mb: 1, mt: 2 }}>
                Data Custodian Networks
            </Typography>
            <Typography component="p" sx={{ mb: 2 }}>
                A Data Custodian Network represents data resources from multiple Teams/organisations
                (e.g., national research network). Networks update automatically when a contributing
                Data Custodian adds new resources. Networks can be accessed via homepage tiles or
                Search → Collections/Networks. Setup requires support from the Technology Team.
            </Typography>

            <Typography component="h2" variant="h2" sx={{ fontSize: 22, mb: 1, mt: 2 }}>
                Data Access Requirements
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                <li>
                    <strong>Description of proposed study:</strong> Include technical and lay
                    summaries.
                </li>
                <li>
                    <strong>Specific data types:</strong> List the exact dataset elements, variables,
                    or categories needed.
                </li>
                <li>
                    <strong>Potential patient benefit:</strong> Explain how this research could
                    benefit patients or the wider public.
                </li>
            </Box>

            <Typography component="h2" variant="h2" sx={{ fontSize: 22, mb: 1, mt: 2 }}>
                Data Access Process
            </Typography>
            <Typography component="p" sx={{ mb: 1 }}>
                <strong>License Agreement:</strong> Data access is non-exclusive and only for the
                approved purpose.
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                <li>
                    Any intellectual property (IP) generated from use of the data is owned by the
                    company*
                </li>
                <li>Licences are time-limited, typically 3 years</li>
                <li>Data access is provided through a Google Cloud Storage Bucket</li>
            </Box>
            <Typography component="p" sx={{ mb: 2 }}>
                *For different IP arrangements, contact the Cancer Data Hub team to discuss options.
            </Typography>
        </Box>
    );
}
