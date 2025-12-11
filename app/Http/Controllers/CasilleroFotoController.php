<?php

namespace App\Http\Controllers;

use App\Models\CasilleroFoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CasilleroFotoController extends Controller
{
    /**
     * Get all active panoramic photos
     */
    public function index()
    {
        $fotos = CasilleroFoto::activas()
            ->get()
            ->map(function ($foto) {
                return [
                    'id' => $foto->Id,
                    'nombre' => mb_convert_encoding($foto->nombre, 'UTF-8', 'Windows-1252'),
                    'descripcion' => $foto->descripcion ? mb_convert_encoding($foto->descripcion, 'UTF-8', 'Windows-1252') : null,
                    'ruta_imagen' => $foto->ruta_imagen,
                    'image_url' => asset('storage/' . $foto->ruta_imagen),
                    'area' => mb_convert_encoding($foto->area, 'UTF-8', 'Windows-1252'),
                ];
            });

        return response()->json($fotos);
    }

    /**
     * Upload a new panoramic photo
     */
    public function upload(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:255',
            'area' => 'required|in:Hombres,Mujeres',
            'imagen' => 'required|image|mimes:jpeg,jpg,png|max:10240', // Max 10MB
            'orden' => 'nullable|integer',
        ]);

        // Store the image
        if ($request->hasFile('imagen')) {
            $file = $request->file('imagen');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('casilleros', $filename, 'public');

            // Create database record
            \DB::connection('access')->table('casillero_fotos')->insert([
                'nombre' => $validated['nombre'],
                'descripcion' => $validated['descripcion'] ?? null,
                'ruta_imagen' => $path,
                'area' => $validated['area'],
                'orden' => $validated['orden'] ?? 0,
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Foto panorámica subida exitosamente',
                'path' => $path,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No se pudo subir la imagen',
        ], 400);
    }

    /**
     * Delete a panoramic photo
     */
    public function destroy($id)
    {
        $foto = CasilleroFoto::findOrFail($id);

        // Delete file from storage
        if (Storage::disk('public')->exists($foto->ruta_imagen)) {
            Storage::disk('public')->delete($foto->ruta_imagen);
        }

        // Delete database record
        $foto->delete();

        return response()->json([
            'success' => true,
            'message' => 'Foto eliminada exitosamente',
        ]);
    }

    /**
     * Toggle active status
     */
    public function toggleActive($id)
    {
        $foto = CasilleroFoto::findOrFail($id);
        $foto->update([
            'activo' => !$foto->activo,
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'activo' => $foto->activo,
        ]);
    }
}
