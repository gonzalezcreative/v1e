import React, { useState } from 'react';
import { Settings, Mail, Building, KeyRound, Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { 
  updatePassword, 
  sendEmailVerification,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export default function AccountSettings() {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateBusinessName = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateDoc(doc(db, 'users', user.id), {
        businessName: businessName
      });
      setSuccess('Business name updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update business name');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user?.email) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser!, credential);
      await updatePassword(auth.currentUser!, newPassword);
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerification = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await sendEmailVerification(auth.currentUser);
      setSuccess('Verification email sent. Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150 ease-in-out"
      >
        <div className="flex items-center">
          <Settings className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="p-6 border-t border-gray-200">
          {(error || success) && (
            <div className={`p-4 mb-4 rounded-md ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              <div className="flex items-center">
                {error ? (
                  <AlertCircle className="h-5 w-5 mr-2" />
                ) : (
                  <Check className="h-5 w-5 mr-2" />
                )}
                <p>{error || success}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Email Verification */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              {auth.currentUser?.emailVerified ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Check className="h-4 w-4 mr-1" />
                  Verified
                </span>
              ) : (
                <button
                  onClick={handleSendVerification}
                  disabled={loading}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Send Verification Email
                </button>
              )}
            </div>

            {/* Business Name */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Building className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Business Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-500">{user?.businessName || 'Not set'}</p>
                  )}
                </div>
              </div>
              {isEditing ? (
                <div className="space-x-2">
                  <button
                    onClick={handleUpdateBusinessName}
                    disabled={loading}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setBusinessName(user?.businessName || '');
                    }}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              )}
            </div>

            {/* Password Update */}
            <div>
              <div className="flex items-center mb-4">
                <KeyRound className="h-5 w-5 text-gray-400 mr-2" />
                <p className="text-sm font-medium text-gray-700">Update Password</p>
              </div>
              <div className="space-y-3">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current Password"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <button
                  onClick={handleUpdatePassword}
                  disabled={loading || !currentPassword || !newPassword}
                  className={`w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading || !currentPassword || !newPassword ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}