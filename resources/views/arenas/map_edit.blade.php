@extends('layouts.container')

@section('title', 'Edición de Pozo')

@section('content')

<div class="page-header">
    <h1>Sección de edición de la información del pozo {{ ucfirst(strtolower($well->name)) }}</h1>
</div>

@if (session()->has('error'))
    <div class="alert alert-danger">{{ session('error') }}</div>
@endif

<form action="{{ url('arenas/map/' . $well->id) }}" method="POST">
    {{ method_field('PUT') }}
    {{ csrf_field() }}
    
    <div class="form-group">
        <label class="col-sm-2" for="longitude">Longitud: </label>
        <input class="col-sm-10" type="text" name="longitude" value="{{ old('longitude') ?: $well->longitude ?: '-' }}">
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="latitude">Latitud: </label>
        <input class="col-sm-10" type="text" name="latitude" value="{{ old('latitude') ?: $well->latitude ?: '-' }}">
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="install_date">Fecha de Instalación del Mecanismo de Control de Arenas: </label>
        <input class="col-sm-10" type="text" name="install_date" value="{{ old('install_date') ?: $sandControl->install_date ?: '-' }}">
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="event">Siglas del Evento: </label>
        {{ $generate_select('event', old('event') ?: $sandControl->event, "col-sm-10") }}
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="mechanism">Mecanismo de Control de Arena: </label>
        {{ $generate_select('mechanism', old('mechanism') ?: $sandControl->mechanism, "col-sm-10") }}
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="group">Grupo: </label>
        {{ $generate_select('group', old('group') ?: $sandControl->group, "col-sm-10") }}
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="completion_type">Tipo de completamiento según el empaquetamiento de grava: </label>
        {{ $generate_select('completion_type', old('completion_type') ?: $sandControl->completion_type, "col-sm-10") }}
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="mesh_type">Tipo de malla: </label>
        {{ $generate_select('mesh_type', old('mesh_type') ?: $sandControl->mesh_type, "col-sm-10") }}
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="gravel_size">Tamaño de la Grava (US Mesh): </label>
        <input class="col-sm-10" type="text" name="gravel_size" value="{{ old('gravel_size') ?: $sandControl->gravel_size ?: '-' }}">
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="grade">Grado: </label>
        <input class="col-sm-10" type="text" name="grade" value="{{ old('grade') ?: $sandControl->grade ?: '-' }}">
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="joints">Número de juntas bajadas: </label>
        <input class="col-sm-10" type="text" name="joints" value="{{ old('joints') ?: $sandControl->joints ?: '-' }}">
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="diameter">Diámetro Nominal (in): </label>
        <input class="col-sm-10" type="text" name="diameter" value="{{ old('diameter') ?: $sandControl->diameter ?: '-' }}">
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="internal_diameter">Diámetro Interno: </label>
        <input class="col-sm-10" type="text" name="internal_diameter" value="{{ old('internal_diameter') ?: $sandControl->internal_diameter ?: '-' }}">
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="clearance">Holgura (in): </label>
        <input class="col-sm-10" type="text" name="clearance" value="{{ old('clearance') ?: $sandControl->clearance ?: '-' }}">
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="top">Tope del mecanismo (ft): </label>
        <input class="col-sm-10" type="text" name="top" value="{{ old('top') ?: $sandControl->top ?: '-' }}">
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="length">Fondo del mecanismo: </label>
        <input class="col-sm-10" type="text" name="length" value="{{ old('length') ?: $sandControl->length ?: '-' }}">
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="bottom">Longitud (ft): </label>
        <input class="col-sm-10" type="text" name="bottom" value="{{ old('bottom') ?: $sandControl->bottom ?: '-' }}">
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="weight">Peso Nominal (lb/ft): </label>
        <input class="col-sm-10" type="text" name="weight" value="{{ old('weight') ?: $sandControl->weight ?: '-' }}">
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="slots_per_feet">Número de ranuras por pie: </label>
        <input class="col-sm-10" type="text" name="slots_per_feet" value="{{ old('slots_per_feet') ?: $sandControl->slots_per_feet ?: '-' }}">
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="slot_width">Ancho de la ranura del liner (in): </label>
        <input class="col-sm-10" type="text" name="slot_width" value="{{ old('slot_width') ?: $sandControl->slot_width ?: '-' }}">
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="mesh">Mesh: </label>
        <input class="col-sm-10" type="text" name="mesh" value="{{ old('mesh') ?: $sandControl->mesh ?: '-' }}">
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="slot_gauge">Slot Gauge de la malla (in): </label>
        <input class="col-sm-10" type="text" name="slot_gauge" value="{{ old('slot_gauge') ?: $sandControl->slot_gauge ?: '-' }}">
    </div>
    <div class="form-group">
        <label class="col-sm-2" for="ideal_size">Tamaño de grano ideal para completar  con el pozo con el mecanismo de control seleccionado (micrómetros): </label>
        <input class="col-sm-10" type="text" name="ideal_size" value="{{ old('ideal_size') ?: $sandControl->ideal_size ?: '-' }}">
    </div>
    <div class="fluid-container text-center">
        <input type="submit" name="submit" value="Actualizar" class="btn btn-success">
    </div>
</form>

@endsection