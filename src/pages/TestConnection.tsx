import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { testAllAuth } from '@/utils/testAuth'

export default function TestConnection() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    setResults([])
    
    // Test direct database access
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1)
      
      setResults(prev => [...prev, {
        test: 'Database Access',
        success: !error,
        error: error?.message
      }])
    } catch (error) {
      setResults(prev => [...prev, {
        test: 'Database Access',
        success: false,
        error: error.message
      }])
    }

    // Test authentication
    await testAllAuth()
    
    setLoading(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Connection Tests</h1>
      <Button onClick={runTests} disabled={loading}>
        {loading ? 'Running Tests...' : 'Run Tests Again'}
      </Button>
      
      <div className="mt-6 space-y-4">
        {results.map((result, i) => (
          <div key={i} className={`p-4 border rounded-lg ${
            result.success ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <h3 className="font-medium">{result.test}</h3>
            <p>Status: {result.success ? '✅ Success' : '❌ Failed'}</p>
            {result.error && (
              <pre className="mt-2 text-sm text-red-600">{result.error}</pre>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}