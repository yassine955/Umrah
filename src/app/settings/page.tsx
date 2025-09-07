"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/components/providers"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Bell,
    Globe,
    Save,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle
} from "lucide-react"

function SettingsPageContent() {
    const { user, session, loading } = useSupabase()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        passportNumber: "",
        passportExpiry: "",
        nationality: "",
        address: "",
        city: "",
        country: "",
        postalCode: ""
    })

    // Notification preferences
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        smsNotifications: false,
        bookingUpdates: true,
        promotionalEmails: false,
        priceAlerts: true,
        travelReminders: true
    })

    // Security settings
    const [securityForm, setSecurityForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })

    // Redirect if not authenticated (only on client side)
    useEffect(() => {
        if (!loading && !session) {
            router.push("/auth/signin")
        }
    }, [session, router, loading])

    // Load user data
    useEffect(() => {
        if (user) {
            setProfileForm(prev => ({
                ...prev,
                fullName: user.user_metadata?.full_name || "",
                email: user.email || "",
                phone: user.user_metadata?.phone || "",
                passportNumber: user.user_metadata?.passport_number || "",
                passportExpiry: user.user_metadata?.passport_expiry || "",
                nationality: user.user_metadata?.nationality || "",
                address: user.user_metadata?.address || "",
                city: user.user_metadata?.city || "",
                country: user.user_metadata?.country || "",
                postalCode: user.user_metadata?.postal_code || ""
            }))
        }
    }, [user])

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        // Basic validation
        if (!profileForm.fullName.trim()) {
            setMessage({ type: 'error', text: 'Full name is required' })
            setIsLoading(false)
            return
        }

        try {
            // Check if user is authenticated
            const { data: { session } } = await supabase.auth.getSession()
            console.log('Current session:', session?.user?.email)

            if (!session) {
                setMessage({ type: 'error', text: 'You must be logged in to update your profile' })
                setIsLoading(false)
                return
            }

            // Use Supabase client directly for profile update
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: profileForm.fullName,
                    phone: profileForm.phone,
                    passport_number: profileForm.passportNumber,
                    passport_expiry: profileForm.passportExpiry,
                    nationality: profileForm.nationality,
                    address: profileForm.address,
                    city: profileForm.city,
                    country: profileForm.country,
                    postal_code: profileForm.postalCode
                }
            })

            if (error) {
                console.error('Profile update error:', error)
                setMessage({ type: 'error', text: error.message })
            } else {
                setMessage({ type: 'success', text: 'Profile updated successfully!' })
                // Clear the message after 3 seconds
                setTimeout(() => setMessage(null), 3000)
                // Refresh the page to show updated data
                setTimeout(() => window.location.reload(), 2000)
            }
        } catch (error) {
            console.error('Profile update error:', error)
            setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' })
        } finally {
            setIsLoading(false)
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        // Validation
        if (securityForm.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters long' })
            setIsLoading(false)
            return
        }

        if (securityForm.newPassword !== securityForm.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' })
            setIsLoading(false)
            return
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: securityForm.newPassword
            })

            if (error) {
                setMessage({ type: 'error', text: error.message })
            } else {
                setMessage({ type: 'success', text: 'Password updated successfully!' })
                setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
                // Clear the message after 3 seconds
                setTimeout(() => setMessage(null), 3000)
            }
        } catch (error) {
            console.error('Password update error:', error)
            setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleNotificationChange = (key: string, value: boolean) => {
        setNotifications(prev => ({ ...prev, [key]: value }))
        // In a real app, you would save this to the database
        setMessage({ type: 'success', text: 'Notification preferences updated!' })
    }

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading settings...</p>
                </div>
            </div>
        )
    }

    // Show nothing if not authenticated (will redirect)
    if (!session) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                    <p className="text-gray-600">Manage your account settings and preferences</p>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                        {message.type === 'success' ? (
                            <CheckCircle className="h-5 w-5" />
                        ) : (
                            <AlertCircle className="h-5 w-5" />
                        )}
                        {message.text}
                    </div>
                )}

                {/* Debug info - remove in production */}
                {process.env.NODE_ENV === 'development' && !loading && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Debug Info</h3>
                        <p className="text-sm text-blue-700">User: {user?.email || 'Not logged in'}</p>
                        <p className="text-sm text-blue-700">Session: {session ? 'Active' : 'No session'}</p>
                        <p className="text-sm text-blue-700">Loading: {loading ? 'Yes' : 'No'}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Settings */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Profile Information
                                </CardTitle>
                                <CardDescription>
                                    Update your personal information and travel documents
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="fullName">Full Name *</Label>
                                            <Input
                                                id="fullName"
                                                value={profileForm.fullName}
                                                onChange={(e) => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
                                                placeholder="Enter your full name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={profileForm.email}
                                                disabled
                                                className="bg-gray-100"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                value={profileForm.phone}
                                                onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                                                placeholder="+31 6 12345678"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="nationality">Nationality</Label>
                                            <Select
                                                value={profileForm.nationality}
                                                onValueChange={(value) => setProfileForm(prev => ({ ...prev, nationality: value }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select nationality" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="dutch">Dutch</SelectItem>
                                                    <SelectItem value="belgian">Belgian</SelectItem>
                                                    <SelectItem value="german">German</SelectItem>
                                                    <SelectItem value="french">French</SelectItem>
                                                    <SelectItem value="british">British</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                                            <Shield className="h-4 w-4" />
                                            Travel Documents
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="passportNumber">Passport Number</Label>
                                                <Input
                                                    id="passportNumber"
                                                    value={profileForm.passportNumber}
                                                    onChange={(e) => setProfileForm(prev => ({ ...prev, passportNumber: e.target.value }))}
                                                    placeholder="Enter passport number"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="passportExpiry">Passport Expiry Date</Label>
                                                <Input
                                                    id="passportExpiry"
                                                    type="date"
                                                    value={profileForm.passportExpiry}
                                                    onChange={(e) => setProfileForm(prev => ({ ...prev, passportExpiry: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            Address Information
                                        </h4>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="address">Street Address</Label>
                                                <Input
                                                    id="address"
                                                    value={profileForm.address}
                                                    onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                                                    placeholder="Enter street address"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <Label htmlFor="city">City</Label>
                                                    <Input
                                                        id="city"
                                                        value={profileForm.city}
                                                        onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                                                        placeholder="Enter city"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="country">Country</Label>
                                                    <Select
                                                        value={profileForm.country}
                                                        onValueChange={(value) => setProfileForm(prev => ({ ...prev, country: value }))}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select country" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="netherlands">Netherlands</SelectItem>
                                                            <SelectItem value="belgium">Belgium</SelectItem>
                                                            <SelectItem value="germany">Germany</SelectItem>
                                                            <SelectItem value="france">France</SelectItem>
                                                            <SelectItem value="uk">United Kingdom</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label htmlFor="postalCode">Postal Code</Label>
                                                    <Input
                                                        id="postalCode"
                                                        value={profileForm.postalCode}
                                                        onChange={(e) => setProfileForm(prev => ({ ...prev, postalCode: e.target.value }))}
                                                        placeholder="1234 AB"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={isLoading || !profileForm.fullName.trim()} className="w-full">
                                        <Save className="h-4 w-4 mr-2" />
                                        {isLoading ? 'Saving...' : 'Save Profile'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Security Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Security
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <div>
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="newPassword"
                                                type={showPassword ? "text" : "password"}
                                                value={securityForm.newPassword}
                                                onChange={(e) => setSecurityForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                                placeholder="Enter new password"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={securityForm.confirmPassword}
                                            onChange={(e) => setSecurityForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                    <Button type="submit" disabled={isLoading} className="w-full">
                                        Update Password
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Notification Preferences */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Notifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Email Notifications</Label>
                                        <p className="text-sm text-gray-500">Receive updates via email</p>
                                    </div>
                                    <Switch
                                        checked={notifications.emailNotifications}
                                        onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>SMS Notifications</Label>
                                        <p className="text-sm text-gray-500">Receive updates via SMS</p>
                                    </div>
                                    <Switch
                                        checked={notifications.smsNotifications}
                                        onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Booking Updates</Label>
                                        <p className="text-sm text-gray-500">Updates about your bookings</p>
                                    </div>
                                    <Switch
                                        checked={notifications.bookingUpdates}
                                        onCheckedChange={(checked) => handleNotificationChange('bookingUpdates', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Price Alerts</Label>
                                        <p className="text-sm text-gray-500">Price drop notifications</p>
                                    </div>
                                    <Switch
                                        checked={notifications.priceAlerts}
                                        onCheckedChange={(checked) => handleNotificationChange('priceAlerts', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Travel Reminders</Label>
                                        <p className="text-sm text-gray-500">Reminders before travel</p>
                                    </div>
                                    <Switch
                                        checked={notifications.travelReminders}
                                        onCheckedChange={(checked) => handleNotificationChange('travelReminders', checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    Account Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Email Verified</span>
                                    <Badge className="bg-green-100 text-green-800">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Verified
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Account Status</span>
                                    <Badge className="bg-green-100 text-green-800">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Active
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Member Since</span>
                                    <span className="text-sm text-gray-600">
                                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Last Updated</span>
                                    <span className="text-sm text-gray-600">
                                        {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Export with dynamic import to prevent SSR hydration issues
export default dynamic(() => Promise.resolve(SettingsPageContent), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading settings...</p>
            </div>
        </div>
    )
})
