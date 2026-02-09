import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  getTeamMembers, 
  createTeamMember, 
  resetMemberPassword, 
  deleteTeamMember, 
  updateOwnPassword, 
  type TeamMember 
} from "@/services/apiSetting"
import { toast } from "sonner"
import { 
  UserPlus, 
  Key, 
  Loader2, 
  UserCircle, 
  Trash2, 
  X, 
  ShieldCheck, 
  Lock, 
  UserCog 
} from "lucide-react"

// Define the shape of our form data
interface NewMemberForm {
  username: string;
  email: string;
  password: string;
  role: "staff" | "manager";
}

export function AdminSettings() {
  const qc = useQueryClient()
  
  // State for adding new members
  const [newMember, setNewMember] = useState<NewMemberForm>({ 
    username: "", 
    email: "", 
    password: "", 
    role: "staff" 
  })

  // State for the Reset Password Modal
  const [resetTarget, setResetTarget] = useState<TeamMember | null>(null)
  const [newPassInput, setNewPassInput] = useState("")

  // State for Owner changing their own password
  const [selfSecurity, setSelfSecurity] = useState({ oldPassword: "", newPassword: "" })

  // --- QUERIES ---
  const { data: team = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ["team-members"],
    queryFn: getTeamMembers,
  })

  // --- MUTATIONS ---
  const { mutate: handleCreate, isPending: isCreating } = useMutation({
    mutationFn: (data: NewMemberForm) => createTeamMember(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["team-members"] })
      toast.success("Team member created successfully!")
      setNewMember({ username: "", email: "", password: "", role: "staff" })
    },
    onError: (err: any) => toast.error(err.response?.data?.error || "Failed to create member")
  })

  const { mutate: handleDelete } = useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["team-members"] })
      toast.success("Member removed from system")
    }
  })

  const { mutate: handleUpdateSelf, isPending: isUpdatingSelf } = useMutation({
    mutationFn: updateOwnPassword,
    onSuccess: () => {
      toast.success("Your credentials have been updated")
      setSelfSecurity({ oldPassword: "", newPassword: "" })
    },
    onError: () => toast.error("Current password was incorrect")
  })

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h2 className="text-2xl font-extrabold text-white">Agency Settings</h2>
        <p className="text-white/60">Manage your team access and security protocols.</p>
      </header>

      {/* 1. CREATE TEAM MEMBER SECTION */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-brand/20 rounded-lg text-brand">
             <UserPlus className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Add Team Member</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
             <label className="text-xs font-bold text-white/40 ml-1">USERNAME</label>
             <input 
               className="w-full bg-black/40 border border-white/10 p-3.5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand/50" 
               placeholder="josh_staff"
               value={newMember.username}
               onChange={e => setNewMember({...newMember, username: e.target.value})}
             />
          </div>
          <div className="space-y-1">
             <label className="text-xs font-bold text-white/40 ml-1">EMAIL ADDRESS</label>
             <input 
               className="w-full bg-black/40 border border-white/10 p-3.5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand/50" 
               placeholder="staff@ossireliva.com"
               value={newMember.email}
               onChange={e => setNewMember({...newMember, email: e.target.value})}
             />
          </div>
          <div className="space-y-1">
             <label className="text-xs font-bold text-white/40 ml-1">INITIAL PASSWORD</label>
             <input 
               type="password"
               className="w-full bg-black/40 border border-white/10 p-3.5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand/50" 
               placeholder="••••••••"
               value={newMember.password}
               onChange={e => setNewMember({...newMember, password: e.target.value})}
             />
          </div>
          <div className="space-y-1">
             <label className="text-xs font-bold text-white/40 ml-1">ACCESS ROLE</label>
             <select 
               className="w-full bg-black/40 border border-white/10 p-3.5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand/50"
               value={newMember.role}
               onChange={e => setNewMember({...newMember, role: e.target.value as any})}
             >
               <option value="staff">Staff (Logistics Only)</option>
               <option value="manager">Manager (Full Control)</option>
             </select>
          </div>
        </div>

        <button 
          onClick={() => handleCreate(newMember)}
          disabled={isCreating}
          className="mt-6 bg-brand text-black px-8 py-4 rounded-2xl font-bold hover:scale-[1.02] transition flex items-center gap-2 disabled:opacity-50"
        >
          {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
          Finalize Access
        </button>
      </section>

      {/* 2. TEAM MANAGEMENT TABLE */}
      <section className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">Active Personnel</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/20 text-white/40 text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="p-6">User</th>
                <th className="p-6">Role</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {team.map((m) => (
                <tr key={m.id} className="hover:bg-white/[0.02] transition">
                  <td className="p-6 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                      <UserCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{m.username}</p>
                      <p className="text-xs text-white/40">{m.email}</p>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                      m.role === 'manager' ? 'bg-brand/10 text-brand border-brand/20' : 'bg-white/5 text-white/60 border-white/10'
                    }`}>
                      {m.role}
                    </span>
                  </td>
                  <td className="p-6 text-right space-x-2">
                    <button 
                      onClick={() => setResetTarget(m)}
                      className="p-2 hover:bg-brand/20 rounded-lg text-white/40 hover:text-brand transition"
                      title="Reset Password"
                    >
                      <Key className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        if(confirm(`Remove ${m.username} from system?`)) handleDelete(m.id)
                      }}
                      className="p-2 hover:bg-red-500/20 rounded-lg text-white/40 hover:text-red-400 transition"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. OWNER SECURITY SECTION (CHANGE OWN PASSWORD) */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
             <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">My Security Credentials</h3>
        </div>
        
        <div className="space-y-4">
           <div className="space-y-1">
              <label className="text-xs font-bold text-white/40 ml-1">CURRENT PASSWORD</label>
              <input 
                type="password"
                className="w-full bg-black/40 border border-white/10 p-3.5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500/50" 
                value={selfSecurity.oldPassword}
                onChange={e => setSelfSecurity({...selfSecurity, oldPassword: e.target.value})}
              />
           </div>
           <div className="space-y-1">
              <label className="text-xs font-bold text-white/40 ml-1">NEW PASSWORD</label>
              <input 
                type="password"
                className="w-full bg-black/40 border border-white/10 p-3.5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500/50" 
                value={selfSecurity.newPassword}
                onChange={e => setSelfSecurity({...selfSecurity, newPassword: e.target.value})}
              />
           </div>
           <button 
             onClick={() => handleUpdateSelf({ 
               old_password: selfSecurity.oldPassword, 
               new_password: selfSecurity.newPassword 
             })}
             disabled={isUpdatingSelf}
             className="bg-white/10 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-white/20 transition flex items-center gap-2 disabled:opacity-50"
           >
             {isUpdatingSelf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
             Update Owner Password
           </button>
        </div>
      </section>

      {/* RESET PASSWORD MODAL */}
      {resetTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
            <button 
              onClick={() => {
                setResetTarget(null)
                setNewPassInput("")
              }} 
              className="absolute top-6 right-6 text-white/40 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 bg-brand/20 rounded-full flex items-center justify-center text-brand mb-4">
                <UserCog className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Reset Personnel Access</h3>
              <p className="text-white/40 text-sm mb-6">Setting new password for <b>{resetTarget.username}</b></p>
            </div>

            <div className="space-y-4">
              <input 
                type="password" 
                autoFocus
                className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand"
                placeholder="Enter temporary password"
                value={newPassInput}
                onChange={e => setNewPassInput(e.target.value)}
              />
              <button 
                onClick={() => {
                  resetMemberPassword(resetTarget.id, newPassInput).then(() => {
                    toast.success(`Access updated for ${resetTarget.username}`)
                    setResetTarget(null)
                    setNewPassInput("")
                  })
                }}
                className="w-full bg-brand text-black font-bold py-4 rounded-2xl hover:opacity-90 transition shadow-lg shadow-brand/10"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}