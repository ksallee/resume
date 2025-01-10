export const load = async ({fetch}) => {
    const response = await fetch('/data/resume.json');
    if (!response.ok) {
        throw new Error('Failed to fetch resume.json');
    }
    const data = await response.json();
    return {
        profile: data
    };
};
