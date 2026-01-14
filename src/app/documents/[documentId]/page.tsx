import { Editor } from "./editor";
import { Toolbar } from "./toolbar";
interface DocumentsPageProps {
    params: Promise<{
        documentId: string;
    }>;
}

const DocumentsPage = async ({ params }: DocumentsPageProps) => {
    const { documentId } = await params;

    return (
        <div className="min-h-screen bg-[#FAFBFD]">
            <Toolbar/>
            <Editor />
        </div>
    );
};

export default DocumentsPage;
