import { supabase } from "./config";

export class ProgramService {
    client
    constructor() {
        this.client = supabase
    }

    async getProgramsByUniversity(universityId) {
        const { data, error } = await this.client
            .from('programs')
            .select('*')
            .eq('university_id', universityId)
        if (error) throw error
        return data
    }
}

const programService = new ProgramService()
export default programService