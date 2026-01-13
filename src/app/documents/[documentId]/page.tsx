import { Editor } from "./editor";
interface DocumentsPageProps {
    params: Promise<{
        documentId: string;
    }>;
}

const DocumentsPage = async ({ params }: DocumentsPageProps) => {
    const { documentId } = await params;

    return (
        <div className="min-h-screen bg-[#FAFBFD]">
            <Editor />
        </div>
    );
};

export default DocumentsPage;
