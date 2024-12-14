interface SubPrompts {
    id: string;
    UIId: string;
    SUBId: string;
    createdAt: Date;
    subPrompt: string;
    code: string;
}
  
type SubPromptsArray = SubPrompts[][] | undefined;

export const isParent = (subId: string, subPrompts?: SubPromptsArray): boolean => {
    if (!subPrompts || !subId) return false;

    const flatSubPrompts = subPrompts.flat().filter(subPrompt => subPrompt && subPrompt.SUBId);

    return flatSubPrompts.some(subPrompt => {
        try {
            const subPromptParts = subPrompt.SUBId.split('-');
            const subIdParts = subId.split('-');

            return (
                subPromptParts.length > subIdParts.length &&
                subPromptParts.slice(0, subIdParts.length).join('-') === subId
            );
        } catch (error) {
            console.error('Error processing subPrompt:', error);
            return false;
        }
    });
};